//제스처 라이브러리.
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function EmojiSticker({ imageSize, stickerSource }) {
  //공유값 설정. 작은데이터 변경이 가능하고 최근값에 기초한 애니메이션을 가능하게함.
  const scaleImage = useSharedValue(imageSize);
  //왜 객체로 저장하지 않느냐?
  //x축의 값만 변경됐을 때, 전체 객체를 변경하는 것보다 x축만 변경하는게 효율적이기 때문.
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  //탭을 감지, 탭이 두번이다? onStart()
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      //스케일이미지의 값이 이미지사이즈의 2배가 아니라면, 2배로 변경
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      }
    });
  //드래그 감지 및 좌표값 변경.
  //event.changeX, event.changeY는 이벤트가 발생했을 때의 변화값을 의미.
  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });
  //드래그 추적 값으로 이미지 좌표 변경
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  //이미지 크기 변경
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });
  return (
    <GestureDetector gesture={drag}>
      {/* Animated컴포넌트는 컴포넌트의 style prop을 바라본다. 
        애니메이션을 적용할 값을 결정하고, 업데이트를 적용한다.   */}
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
