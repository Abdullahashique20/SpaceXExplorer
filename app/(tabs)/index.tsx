import { Card, SearchBar } from '@rneui/base';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { getListData } from './spaceXService';

const PRIMARY_COLOR = '#ff9933'; // You can change this to your preferred primary color

export default function HomeScreen() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  let width = Dimensions.get('window').width

  const getInfoList = async () => {
    getListData().then((res) => {
      setData(res.data)
      setFilteredData(res.data);
    }).catch((err) => {
      console.log("Error in get list data", err);
    })
  }

  useEffect(() => {
    getInfoList()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(item =>
          item?.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, data]);

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
      <View style={{ height: StatusBar.currentHeight, backgroundColor: PRIMARY_COLOR }}>
        <StatusBar barStyle="light-content" />
      </View>
      <View>
        <SearchBar
          placeholder="Search launches..."
          value={search}
          onChangeText={setSearch}
          platform="default"
          containerStyle={{ backgroundColor: "white" }}
          inputContainerStyle={{ backgroundColor: "#eee" }}
        />
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {filteredData.length === 1 ? (
          <Card containerStyle={{ borderRadius: 16, width: '50%', padding: 10, marginTop: 32 }}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/listDetails', params: { launchpad: JSON.stringify(filteredData[0]) } })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: filteredData[0]?.links?.patch?.small }}
                  style={{ width: 60, height: 60, resizeMode: 'contain', marginRight: 24 }}
                />
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{filteredData[0]?.name}</Text>
                  <Text style={{ fontSize: 11 }}>{new Date(filteredData[0]?.date_utc).toLocaleDateString()}</Text>
                  <Text style={{ color: filteredData[0]?.success ? 'green' : 'red', fontSize: 13 }}>
                    {filteredData[0]?.success ? 'Success' : 'Failed'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item?.id}
            renderItem={renderItem}
            numColumns={width > 600 ? 3 : 2}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.5}
            // contentContainerStyle={{ flex: filteredData?.length == 0 ? 1 : null }}
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text>No launches found</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}


