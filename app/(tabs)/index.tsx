import { Card, SearchBar } from '@rneui/base';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { getListData } from './spaceXService';


export default function HomeScreen() {

  const [data, setData] = useState([])
  let width = Dimensions.get('window').width

  const getInfoList = async () => {
    getListData().then((res) => {
      console.log("ressssssss", res);
      setData(res.data)

    }).catch((err) => {
      console.log("errrrrrrr", err);

    })
  }

  useEffect(() => {
    getInfoList()
  }, [])

  const renderItem = ({ item, index }) => {

    let date = new Date(item?.date_utc)

    let formated = date.toLocaleDateString()

    return (
      <Card containerStyle={{ borderRadius: 10, width: '43%' }}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/listDetails', params: { launchpad: JSON.stringify(item) } })}>
          <View key={index} style={{ flexDirection: 'row', flex: 1, justifyContent: "space-between" }}>
            <View style={{}}>
              <Image
                source={{ uri: item?.links?.patch?.small }}
                style={{ width: 60, height: 60, resizeMode: 'contain', }}
              />
            </View>
            <View style={{ paddingHorizontal: 5, }}>
              <Text style={{ fontSize: 16 }}>{item?.name.length > 8 ? item?.name.substring(0, 8) + '...' : item?.name}</Text>
              <Text style={{ fontSize: 11 }}>{formated}</Text>
              <Text style={{ color: item?.success ? 'green' : 'red', fontSize: 13 }}>{item?.success ? 'Success' : 'Failed'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    )

  }


  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: StatusBar.currentHeight, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
      </View>
      <View>
        <SearchBar />
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item?.id}
          renderItem={renderItem}
          numColumns={width > 600 ? 3 : 2}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.5}
          // onEndReached={() => {

          // }}
          // style={{}}
          contentContainerStyle={{}}

        />
        {/* <Text style={{ fontSize: 32 }}>Homeeeee</Text> */}
      </View>
    </View>
  );
}


