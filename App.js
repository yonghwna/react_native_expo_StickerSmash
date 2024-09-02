import { StyleSheet, View } from "react-native";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import * as ImagePicker from "expo-image-picker";
import { useState, useRef } from "react";
import IconButton from "./components/IconButtons";
import CircleButton from "./components/CircleButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
//기본이미지. 이미지 선택하세요~ 하는 이미지를 두는게 더 나을듯? 그리고 터치 시 사진선택 Ui 열리게 하고.
const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  //이거 왜 ref에 저장? => 이미지 보이는 View에 ref를 설정해서 요소를 저장하고, 사진 찍는 함수에 매개변수로 넣어 저장한다.
  const imageRef = useRef();
  //선택한 이모지 상태 => 객체로 바꿔서 여러 개 넣을 수 있게 하면 좋을 듯?
  const [pickedEmoji, setPickedEmoji] = useState(null);
  //모달 상태
  const [isModalVisible, setIsModalVisible] = useState(false);
  //이미지 uri 상태. 이미지를 고르면 해당 이미지의 uri 정보를 저장한다. 이미지 보여줄 때 쓰인다.
  const [selectedImage, setSelectedImage] = useState(null);
  //이미지 상태에 따른 버튼 상태. 이미지가 골라졌다? 수정하는 ui로. 아직 안골라졌다? 선택하는 Ui로.
  const [showAppOptions, setShowAppOptions] = useState(false);
  //유저 권한 요청. 이거왜  getter, setter 사용안했지? 체크
  const [status, requestPermission] = MediaLibrary.usePermissions();

  //set함수를 그대로 사용하는게 아니라, 이 함수가 쓰이는 곳에서, 이 함수가 작동 함으로써 일어나는 기능으로
  //이름을 붙이는게 좋을듯. => 그럼 애초에 setter 함수 이름을 직관적으로 짓던가.
  const onReset = () => {
    setShowAppOptions(false);
  };
  //모달 여는 함수. 이건 또 이름이 애매한데?
  const onAddSticker = () => {
    setIsModalVisible(true);
  };
  //모달 닫는 함수.
  const onModalClose = () => {
    setIsModalVisible(false);
  };
  //이미지 선택하는 함수.
  //LaunchImageLibraryAsync 옵션을 줘서 권한이라던가 설정 가능.
  const pickImageAsync = async () => {
    //ImagePicker.launchImageLibraryAsync는 선택된 이미지 정보를
    //담은 객체를 리턴함.
    //allowsEditing: 이미지 편집 가능 여부
    //quality: 이미지 품질. 0~1 사이의 값.
    //lanuchImageLibraryAsync로 기기 갤러리 이미지 선택하고 취소도 가능하고 기능이 많음.
    //이게 추상화지
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      //일단 콘솔 찍어보고 찝어서 쓰면 됨. 여기선 uri:string 형태 데이터를 가져다 씀.
      setSelectedImage(result.assets[0].uri);
      //이미지 수정 ui로 변경
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };
  //이미지 저장 함수.
  const onSaveImageAsync = async () => {
    try {
      //captureRef : View ref를 받아서 문자열을 리턴한다.
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });
      //localUri를 받아서 파일을 유저의 미디어 라이브러리에 저장한다. 생성된 에셋을 반환하지는 않는다.
      //여기서 localUri는 이미지이거나 비디오 파일인데, 확장자를 포함해야한다.
      //안드로이드에서는 local path를 포함해야한다. 그래서 "file:///" 로 시작함.
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    //앱에서 제스처 넣으려면 최상단 컴포넌트에 감싸야함.
    <GestureHandlerRootView>
      {/* 최상단 뷰  */}
      <View style={styles.container}>
        {/* 이미지 뷰어. 스크린샷으로 사진을 저장하기 위해 ref에 저장한다  */}
        <View ref={imageRef} collapsable={false}>
          {/* 이미지 뷰어. 선택된 이미지를 보여준다. 
          아 애초에 placeholder attribute가 있네. 이걸 기본으로 보여주되,
          selectedImage 있으면 그걸로 보여줌. 삼항연산자로. */}
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {/* 만약 선택된 이모티콘이 있다면, 이미지 뷰어 위에 보여준다. 근데 어떻게 이미지 위에 표시되는거?  */}
          {pickedEmoji && (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          )}
        </View>
        {/* 이미지 선택 후 버튼들. 이미지 선택 후에만 보여짐. */}
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton
                icon="save-alt"
                label="Save"
                onPress={onSaveImageAsync}
              />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button
              theme={"primary"}
              label="Choose a photo"
              onPress={pickImageAsync}
            />
            <Button
              label="Use this photo"
              onPress={() => setShowAppOptions(true)}
            />
          </View>
        )}
        {/* 이모지 선택 모달. 모달이 열리면 EmojiList를 보여준다. */}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
