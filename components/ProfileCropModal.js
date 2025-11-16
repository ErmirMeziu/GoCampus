import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as ImageManipulator from "expo-image-manipulator";
import { useTheme } from "../context/ThemeProvider";


export default function ProfileCropModal({ visible, uri, onClose, onSave }) {
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imgSize, setImgSize] = useState(null);
  const [processedUri, setProcessedUri] = useState(null);
  const [loading, setLoading] = useState(true);

  const PREVIEW = 300;
  const OUTPUT = 300;

  const preprocessImage = async (imageUri) => {
    try {
      
      const resized = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }],
        { compress: 0.95 }
      );

     
      const squareSize = Math.min(resized.width, resized.height);

      const squared = await ImageManipulator.manipulateAsync(
        resized.uri,
        [
          {
            crop: {
              originX: Math.floor((resized.width - squareSize) / 2),
              originY: Math.floor((resized.height - squareSize) / 2),
              width: squareSize,
              height: squareSize,
            },
          },
        ],
        { compress: 0.95 }
      );

      return squared;

    } catch (e) {
      console.log("Preprocess error:", e);
      return { uri: imageUri };
    }
  };


  useEffect(() => {
    if (!visible || !uri) return;

    (async () => {
      setLoading(true);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);

      const safeImage = await preprocessImage(uri);

      Image.getSize(
        safeImage.uri,
        (w, h) => {
          setImgSize({ w, h });
          setProcessedUri(safeImage.uri);
          setLoading(false);
        },
        () => {
          setImgSize(null);
          setProcessedUri(uri);
          setLoading(false);
        }
      );
    })();
  }, [visible, uri]);

  if (!visible) return null;

  if (loading || !imgSize) {
    return (
      <Modal visible={visible} transparent>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      </Modal>
    );
  }

  const { w, h } = imgSize;

  const baseScale = PREVIEW / Math.min(w, h);
  const dispScale = baseScale * zoom;

  const cropSizePx = PREVIEW / dispScale;

  const minCX = cropSizePx / 2;
  const maxCX = w - cropSizePx / 2;
  const minCY = cropSizePx / 2;
  const maxCY = h - cropSizePx / 2;

  const centerX = ((offsetX + 1) / 2) * (maxCX - minCX) + minCX;
  const centerY = ((offsetY + 1) / 2) * (maxCY - minCY) + minCY;

  let originX = centerX - cropSizePx / 2;
  let originY = centerY - cropSizePx / 2;

  originX = Math.max(0, Math.min(originX, w - cropSizePx));
  originY = Math.max(0, Math.min(originY, h - cropSizePx));

  const safeOriginX = Math.floor(originX);
  const safeOriginY = Math.floor(originY);
  const safeSize = Math.floor(Math.min(cropSizePx, w, h));

  const previewW = w * dispScale;
  const previewH = h * dispScale;

  const centerPreview = PREVIEW / 2;

  const translateX = centerPreview - centerX * dispScale;
  const translateY = centerPreview - centerY * dispScale;

  const handleSave = async () => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        processedUri,
        [
          {
            crop: {
              originX: safeOriginX,
              originY: safeOriginY,
              width: safeSize,
              height: safeSize,
            },
          },
          {
            resize: { width: OUTPUT, height: OUTPUT },
          },
        ],
        {
          compress: 0.85,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      onSave(result);
    } catch (e) {
      alert("Crop failed: " + e.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <Text style={styles.title}>Adjust Profile Photo</Text>

        <View style={styles.circleWrapper}>
          <View style={styles.circleMask} />
          <View style={styles.circleClip}>
            <Image
              source={{ uri: processedUri }}
              resizeMode="cover"
              style={{
                width: previewW,
                height: previewH,
                transform: [{ translateX }, { translateY }],
              }}
            />
          </View>
        </View>

        <Text style={styles.label}>Zoom</Text>
        <Slider
          minimumValue={1}
          maximumValue={4}
          value={zoom}
          onValueChange={setZoom}
          style={styles.slider}
          minimumTrackTintColor={theme.primary}
          thumbTintColor={theme.primary}
        />

        <Text style={styles.label}>Move X</Text>
        <Slider
          minimumValue={-1}
          maximumValue={1}
          value={offsetX}
          onValueChange={setOffsetX}
          style={styles.slider}
          minimumTrackTintColor={theme.primary}
          thumbTintColor={theme.primary}
        />

        <Text style={styles.label}>Move Y</Text>
        <Slider
          minimumValue={-1}
          maximumValue={1}
          value={offsetY}
          onValueChange={setOffsetY}
          style={styles.slider}
          minimumTrackTintColor={theme.primary}
          thumbTintColor={theme.primary}
        />

        <View style={styles.actions}>
          <Text style={styles.cancel} onPress={onClose}>
            Cancel
          </Text>
          <Text style={styles.save} onPress={handleSave}>
            Save
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    color: "white",
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "700",
  },
  circleWrapper: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  circleMask: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  circleClip: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "white",
  },
  label: {
    color: "white",
    marginTop: 10,
    marginBottom: 4,
  },
  slider: {
    width: "80%",
  },
  actions: {
    marginTop: 20,
    flexDirection: "row",
    gap: 35,
  },
  cancel: {
    color: "#bbb",
    fontSize: 16,
  },
  save: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "700",
  },
});
