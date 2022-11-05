import React from 'react'
import CommentSkeletonLoader from '../SkeletonLoaders/CommentSkeletonLoader'
import DeleteComment from '../Modals/DeleteComment'
import tw from 'twrnc'
import moment from 'moment'
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import { fonts } from '../../styles/global'
import { FeatherIcon, MaterialIcon } from '../../utils/Icons'
import { useGetComments, useCreateCommentMutation, useStoreNotification } from '../../lib/ReactQuery'
import { useNavigate } from '../../utils/RootNavigation'

interface TypedProps {
  user: {
    id: string
  }
  author: {
    id: string
  }
  slug: string
}

const DishComments: React.FC<TypedProps> = ({ user, author, slug }) => {

  const createCommentMutation = useCreateCommentMutation()
  const storeNotification = useStoreNotification()

  const { data: comments, isLoading, isError }: any = useGetComments(slug)

  const [loading, setLoading] = React.useState<boolean>(false)
  const [modalVisible, setModalVisible] = React.useState(false)

  const [commentId, setCommentId] = React.useState<string>('')
  const [comment, setComment] = React.useState<string>('')
  const [commentHeight, setCommentHeight] = React.useState<number>(10)

  const onComment = async () => {
    setLoading(true)
    await createCommentMutation.mutateAsync({
      comment: comment,
      slug: slug
    },
    {
      onError: (error) => {
        console.error('ON COMMENT', error.response.data)
        setComment('')
        setLoading(false)
      },
      onSuccess: async () => {
        setComment('')
        setLoading(false)
        // send comment notification
        if (user.id !== author.id) {
          const message = `commented on your dish`
          await storeNotification.mutateAsync({
            type: 'COMMENT',
            message: message,
            dishSlug: slug,
            notificationFromId: user.id,
            notificationToId: author.id
          },
          {
            onError: (error: any) => {
              console.error('ON NOTIFICATION', error.response.data)
            },
          })
        }
      }
    })
  }

  return (
    <View style={tw`flex-col w-full px-5 py-3`}>
      <View style={tw`flex-row items-center justify-between w-full`}>
        <Text style={[tw`text-xl text-center text-neutral-500 uppercase`, fonts.fontPoppinsBold]}>Comments</Text>
        <View style={tw`flex-row items-center`}>
          <Text style={[tw`text-sm mx-1`, fonts.fontPoppins]}>{ comments && comments.length }</Text>
          <FeatherIcon
            name="message-square"
            size="small"
            color="#676767"
          />
        </View>
      </View>
      <View style={tw`flex-row-reverse items-center w-full my-3 overflow-hidden rounded-xl border border-neutral-200`}>
        {(comment !== '' && !(/^\s*$/.test(comment))) && (
          <React.Fragment>
            {!loading && (
              <TouchableOpacity
                style={tw`px-2`}
                onPress={onComment}
              >
                <FeatherIcon
                  name="send"
                  size="medium"
                  color="#ABABAB"
                />
              </TouchableOpacity>
            )}
          </React.Fragment>
        )}
        {loading && (
          <Text style={[tw`flex-1 w-full px-3 py-2 text-sm bg-white`, fonts.fontPoppins]}>
            Commenting...
          </Text>
        )}
        {!loading && (
          <TextInput
            style={[tw`flex-1 w-full px-3 py-2 text-sm bg-white`, { height: commentHeight }, fonts.fontPoppins]}
            placeholder="Write your comment..."
            value={comment}
            multiline={true}
            onChangeText={(value: string) => {
              setComment(value)
            }}
            onContentSizeChange={(e) => {
              setCommentHeight(e.nativeEvent.contentSize.height)
            }}
          />
        )}
      </View>
      {(isLoading || isError) && (
        <CommentSkeletonLoader />
      )}
      {!isLoading && (
        <React.Fragment>
          {comments.map((comment: { id: string, content: string, createdAt: Date, user: any }, i: number) => (
            <View key={i} style={tw`flex-row items-start justify-between w-full`}>
              <View style={tw`flex-row items-start w-full`}>
                <TouchableOpacity
                  style={tw`overflow-hidden rounded-full my-3 bg-neutral-200 ${comment.user.profile ? 'p-0' : 'p-3'}`}
                  onPress={() => {
                    useNavigate('UserScreen', { id: comment.user.id })
                  }}
                >
                  {comment.user.profile
                    ? <Image
                        style={tw`flex rounded-full w-[3rem] h-[3rem] bg-neutral-100`}
                        resizeMode="cover"
                        source={{
                          uri: `${ comment.user.profile }`
                        }}
                      />
                    : <FeatherIcon
                        name="user"
                        size="medium"
                        color="#676767"
                      />
                  }
                </TouchableOpacity>
                <View style={tw`flex-1 flex-col mx-3 my-3`}>
                  <TouchableOpacity
                    onPress={() => {
                      useNavigate('UserScreen', { id: comment.user.id })
                    }}
                  >
                    <Text style={[tw`text-base text-neutral-600`, fonts.fontPoppinsBold]}>{ comment.user.name }</Text>
                  </TouchableOpacity>
                  <Text style={[tw`text-sm text-neutral-600 mt-1`, fonts.fontPoppins]}>{ comment.content }</Text>
                  <Text style={[tw`text-xs text-neutral-400 mt-3`, fonts.fontPoppinsLight]}>{ moment(comment.createdAt).fromNow() }</Text>
                </View>
              </View>
              {comment.user.id === user?.id && (
                <View style={tw`-ml-7`}>
                  <TouchableOpacity
                    style={tw`p-2`}
                    onPress={() => {
                      setModalVisible(true)
                      setCommentId(comment.id)
                    }}
                  >
                    <MaterialIcon
                      name="trash"
                      size="small"
                      color="#CDCDCD"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </React.Fragment>
      )}
      <DeleteComment
        id={commentId}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  )
}

export default DishComments