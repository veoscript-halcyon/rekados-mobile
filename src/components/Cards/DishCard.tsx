import React from 'react'
import tw from 'twrnc'
import { MaterialIcon } from '../../utils/Icons'
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import { fonts } from '../../styles/global'
import { useNavigate } from '../../utils/RootNavigation'

interface TypedProps {
  dish: {
    id: string
    title: string
    image: string
    category: string
    location: string
    description: string
    author: string
    youtubeId: string
    ingredients: Object
    procedures: Object
  }
}

const DishCard: React.FC<TypedProps> = ({ dish }) => {
  return (
    <TouchableOpacity
      style={tw`flex flex-col items-start w-full p-3 mb-2 bg-neutral-50 rounded-xl`}
      activeOpacity={0.6}
      onPress={() => {
        useNavigate('DisplayDishScreen', {
          id: dish.id,
          title: dish.title,
          image: dish.image,
          category: dish.category,
          location: dish.location,
          description: dish.description,
          author: dish.author,
          youtubeId: dish.youtubeId,
          ingredients: dish.ingredients,
          procedures: dish.procedures
        })
      }}
    >
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <View style={tw`flex flex-row items-center`}>
          <MaterialIcon
            name="repo"
            size="small"
            color="#c3c3c3"
          />
          <Text style={[tw`text-lg text-neutral-600 mx-2 capitalize`, fonts.fontPoppinsBold]}>{ dish.title }</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Alert', `You Saved ${ dish.title } Successfully!`)
          }}
        >
          <MaterialIcon
            name="heart"
            size="medium"
            color="#c3c3c3"
          />
        </TouchableOpacity>
      </View>
      <View style={tw`w-full overflow-hidden rounded-xl my-3`}>
        <Image
          style={tw`flex w-full h-[10rem]`}
          resizeMode="cover"
          source={{
            uri: `${ dish.image }`
          }}
        />
      </View>
      <View style={tw`py-1`}>
        <Text style={[tw`px-2 py-0.5 rounded-full text-xs text-white bg-[#f2b900]`, fonts.fontPoppinsLight]}>{ dish.category }</Text>
      </View>
      <View style={tw`py-1`}>
        <Text style={[tw`rounded-full text-sm`, fonts.fontPoppinsLight]}>{ dish.description }</Text>
      </View>
      <View style={tw`flex flex-row items-center justify-between w-full pt-3`}>
        <View style={tw`flex flex-row items-center`}>
          <Text style={[tw`rounded-full text-sm text-neutral-400`, fonts.fontPoppinsItalic]}>- { dish.author }</Text>
        </View>
        <View style={tw`flex flex-row items-center`}>
          <MaterialIcon
            name="location"
            size="small"
            color="#c3c3c3"
          />
          <Text style={[tw`ml-1 rounded-full text-sm text-neutral-600`, fonts.fontPoppinsSemiBold]}>{ dish.location }</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default DishCard