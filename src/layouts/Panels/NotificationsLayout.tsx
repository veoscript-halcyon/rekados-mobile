import React from 'react'
import TopHeader from '../../components/TopHeader'
import NotificationCard from '../../components/Cards/NotificationCard'
import NotificationSkeletonLoader from '../../components/SkeletonLoaders/NotificationSkeletonLoader'
import tw from 'twrnc'
import { fonts } from '../../styles/global'
import { ScrollView, View, Text, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native'
import { useGetNotifications, useMarkAllReadNotification } from '../../lib/ReactQuery'

interface TypedProps {
  user: Object | any
}

const NotificationsLayout: React.FC<TypedProps> = ({ user }) => {

  const markAllReadNotification = useMarkAllReadNotification()

  const [markAllReadLoading, setMarkAllReadLoading] = React.useState<boolean>(false)

  const {
    data: notifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  }: any = useGetNotifications(user.id)

  let countUnreadNotifications: any

  // count the unread notifications
  for (let i = 0; i < notifications?.pages?.length; i++) {
    countUnreadNotifications = notifications?.pages[i].notifications.filter((unread: { read: boolean }) => unread.read === false)
  }

  const itemKeyExtractor = (item: any, index: { toString: () => any }) => {
    return index.toString()
  }

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const renderSpinner = () => {
    return <ActivityIndicator style={tw`pb-3`} color='#F3B900' size={40} />
  }

  const headerComponent = () => {
    return (
      <View style={tw`flex-1 flex-col w-full`}>
        <TopHeader
          title="Notification"
          subtitle="We bring you everything that happens."
        />
        <View style={tw`flex-1 flex-row items-center justify-between w-full px-5 pb-5`}>
          <Text style={[tw`text-base text-neutral-500`, fonts.fontPoppins]}>Unread ({countUnreadNotifications?.length})</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                '',
                'Are you sure you want to mark all as read all of your unread notifications?',
                [
                  {
                    text: 'Cancel',
                    style: "cancel"
                  },
                  {
                    text: 'Yes',
                    onPress: async () => {
                      setMarkAllReadLoading(true)
                      await markAllReadNotification.mutateAsync(undefined, {
                        onError: (error: any) => {
                          setMarkAllReadLoading(false)
                          console.error('ON MARK ALL AS READ', error.response.data)
                        },
                        onSuccess: () => {
                          setMarkAllReadLoading(false)
                        }
                      })
                    },
                    style: "default"
                  }
                ],
                {
                  cancelable: true
                }
              )
            }}
          >
            <Text style={[tw`text-base text-yellow-500`, fonts.fontPoppinsLight]}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const listIsEmpty = () => {
    return (
      <View style={tw`flex-1 flex-col items-center justify-center w-full h-full my-3`}>
        <View style={tw`flex-1 w-full max-w-xs h-full`}>
          <Text style={[tw`text-3xl text-neutral-500`, fonts.fontPoppins]}>You don't have notifications yet.</Text>
          <Text style={[tw`my-2 text-lg text-neutral-400`, fonts.fontPoppins]}>When you do, your notifications will shown up here.</Text>
        </View>
      </View>
    )
  }

  const renderData = (item: any) => {
    return (
      <View style={tw`flex px-3`}>
        <NotificationCard notification={item} />
      </View>
    )
  }

  return (
    <View style={tw`flex flex-col w-full`}>
      {(isLoading || markAllReadLoading) && (
        <ScrollView>
          <TopHeader
            title="Notification"
            subtitle="We bring you everything that happens."
          />
          <View style={tw`px-3`}>
            <NotificationSkeletonLoader />
          </View>
        </ScrollView>
      )}
      {!(isLoading || markAllReadLoading) && (
        <FlatList
          ListHeaderComponent={headerComponent}
          ListEmptyComponent={listIsEmpty}
          data={notifications.pages.map((page: any) => page.notifications).flat()}
          renderItem={renderData}
          keyExtractor={itemKeyExtractor}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={isFetchingNextPage ? renderSpinner : null}
        />
      )}
    </View>
  )
}

export default NotificationsLayout