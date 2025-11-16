import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const compressTo1MB = async (uri, initialBase64) => {
  let base64 = initialBase64;
  let quality = 0.9;

  const MAX_BYTES = 1 * 1024 * 1024; 

  const sizeInBytes = (b64) => Math.ceil(b64.length * 3 / 4);

  while (sizeInBytes(base64) > MAX_BYTES && quality > 0.1) {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 900 } }], 
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    base64 = result.base64;
    quality -= 0.1;
  }

  return base64;
};

export const pickImages = async (allowMultiple = true) => {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: allowMultiple,
    base64: true,
    quality: 0.8,
  });

  if (res?.canceled) return [];

  const processed = await Promise.all(
    res.assets.map(async (a) => {
      const base64 = a.base64;

      const bytes = Math.ceil(base64.length * 3 / 4);

      let finalBase64 = base64;

      if (bytes > 1024 * 1024) {
        finalBase64 = await compressTo1MB(a.uri, base64);
      }

      return {
        uri: a.uri,
        base64: finalBase64,
      };
    })
  );

  return processed;
};

export const restoreImages = (base64Array = []) =>
  base64Array.map((b64) => ({
    base64: b64,
    uri: `data:image/jpeg;base64,${b64}`,
  }));

export const cleanData = (obj) => {
  const clean = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) clean[key] = obj[key];
  });
  return clean;
};
