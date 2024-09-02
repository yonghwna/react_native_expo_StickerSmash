import { useState } from "react";
import { StyleSheet, FlatList, Image, Platform, Pressable } from "react-native";

//이모지를 선택하고 리턴시킨다. 기능분리 깔끔한데?
export default function EmojiList({ onSelect, onCloseModal }) {
  //데이터 가져와서 state에 담는다.
  //왜 state에 담는지? => 데이터를 가져와서 사용할 때, 데이터가 변할 수 있기 때문에. 그 시점의 데이터를 저장해놓는다.
  const [emoji] = useState([
    //이렇게 require로 이미지를 가져오는 이유는? => 이미지를 가져올 때, 이미지의 경로를 알아야하는데, require로 가져오면 경로를 알 필요가 없다.
    require("../assets/images/emoji1.png"),
    require("../assets/images/emoji2.png"),
    require("../assets/images/emoji3.png"),
    require("../assets/images/emoji4.png"),
    require("../assets/images/emoji5.png"),
    require("../assets/images/emoji6.png"),
  ]);

  return (
    //목록 렌더링 인터페이스. 당겨서 새로고침, 스크롤 등을 지원한다.
    <FlatList
      //수평
      horizontal
      //웹에서는 스크롤바를 보여준다.
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      //data 삽입
      data={emoji}
      contentContainerStyle={styles.listContainer}
      //아이템 렌더링
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => {
            onSelect(item);
            onCloseModal();
          }}
        >
          <Image source={item} key={index} style={styles.image} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
});
