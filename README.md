# 

# StickerSmash

사용자 라이브러리에서 사진을 가져온 후,스티커를 붙인 후 스크린 샷을 찍어 라이브러리에 저장하는 앱입니다. 
<img width="466" alt="image" src="https://github.com/user-attachments/assets/d7c8d64a-929f-4579-87f1-50afd7e35b81">

React_Native기반 앱 개발 프레임워크인 expo를 경험해보기위해 만들었습니다. 

### 장점

1. 자바스크립트를 사용합니다. 
2. 추상화 수준이 높은 만큼 빠른 프로토타이핑이 가능합니다.
3. 하나의 코드베이스로 IOS, android, 웹을 모두 개발할 수 있습니다. 
4. react_native의 경우 프로젝트를 시작할 때 복잡한 네이티브 환경 설정을 필요로하는데, expo는 별다른 설정없이 설치만으로 프로젝트 시작이 가능합니다. 
5. expo go 앱을 이용해서 실시간으로 테스트가 가능합니다. 

### 단점

1. 네이티브 코드 제어에 제한이 있습니다. react_native를 추상화한 라이브러리이다보니, 아직 구현되지 않은 기능을 사용하려면 eject작업을 거쳐야합니다. 
2. expo가 제공하는 모든 기능이 포함되어 있어서, 기능에 비해 앱의 크기가 큽니다. 
3. 빌드 시간이 굉장히 오래걸립니다. 보일러 플레이트를 빌드하는데도 20분이 소요됐습니다. 

⇒ 이런 이유들로 인해 규모가 있는 서비스에서는 거의 쓰지 않는다고합니다. 

### 느낀 점

앱 개발은 처음이어서 무척 신기했습니다. 모양 자체는 브라우저 웹앱과 비슷했지만, ‘애플리케이션’ 이라는 점이 한층 들뜨게 했습니다. 

구현하는 과정에서 굉장히 많은 라이브러리를 가져다 썻습니다. 제스처를 감지하는 것, 사용자 권한을 받는 것, 애니메이션을 구현하는 것 등 어떤 기능을 하나 구현 할 때마다 라이브러리를 최소 하나는 설치했습니다. 

앱 개발은 처음이어서 React_Native, Flutter 등 과 비교는 하지 못하겠지만, Nextjs 프레임워크가 인기있는 이유 중 하나를 체감했습니다.

스티커를 이동하는 과정에서 드래그 동작 시 좌표값 추적 및 스티커 위치 스타일 적용 로직이 인상적이었습니다. 

pc에 비해 ui구현이 오밀조밀하다. 마치 아토믹 디자인 패턴에서 Organism 단계의 컴포넌트 안에서 작업하는 느낌이었다.  앱 구현에 대한 느낀 점 보다는 모바일 기기에서의 느낀 점이다. 

그것 말고는 pc버전 웹의 구현과 비슷하다. 화면(View)을 만들고 그 속에 작은 컴포넌트들을 배치하고 이벤트 핸들러를 등록하고… 개발환경 구성이 제일 어려웠다. 

개발을 하면서 강의에서 들은 대로 컴포넌트가 여러가지 일을 하지 않게 신경써서 만들었다. 

예를 들면 모달 컴포넌트에 내부의 ui는 children으로 받으면서, 단순히 모달이 켜졌다 꺼졌다만 하게 만드는 식으로. 

```jsx
export default function EmojiPicker({ isVisible, children, onClose }) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a sticker</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
}
```

이러면 모달 재사용도 가능하고, 코드도 단순해진다.

