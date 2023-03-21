// Import the base
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

// Import the modules
import auth from './modules/authentication.js'
import grow from './modules/grow/gwu.js'
import friendRequests from './modules/dashboard/friend_requests.js'
import aetasks from './modules/audio-engineering/tasks.js'
import erreviewers from './modules/elite-reviews/reviewers.js'
import ergenres from './modules/elite-reviews/genres.js'
import ercountries from './modules/elite-reviews/countries.js'
import erstates from './modules/elite-reviews/states.js'
import ertypes from './modules/elite-reviews/types.js'
import ersmedia from './modules/elite-reviews/social-media.js'
import dashboardStats from './modules/dashboard/stats.js'
// import userData from "./modules/profile/collectUserData.js";
import setProfile from './modules/profile/setProfile.js'
import latestShows from './modules/profile/latestShows.js'
import latestTracks from './modules/profile/latestTracks.js'
import influentialConnections from './modules/profile/influentialConnections.js'
import messages from './modules/messages/messages.js'
import notifications from './modules/notifications/notifications'
import analytics from './modules/analytics/page_visits.js'
import stripe from './modules/stripe.js'
import settings from './modules/user/settings.js'
import friendship from './modules/user/friendships'
import locations from './modules/analytics/location'
import feed from './modules/feed/feed'
import likes from './modules/feed/likes'
import reposts from './modules/feed/reposts'
import comments from './modules/feed/comments'
import feedModals from './modules/feed/modals'
import distribution from './modules/distribution/distribution'
import genres from './modules/distribution/genres'
import spotify from './modules/spotify/spotify'
import curatorOrderCart from './modules/curator/curatorOrderCart'
import outlets from './modules/PR/outlets'
import PRorderCart from './modules/PR/PROrderCart'
import intent from './modules/intents/intent'
import IPOrderCart from './modules/instagram-placement/IPOrderCart'
import loading from './modules/page'
import todoList from './modules/dashboard/todoList'
import search from './modules/search'
import mediaTypes from './modules/utils/mediaTypes'
import followers from './modules/user/followers'
import hashtags from './modules/hashtags/hashtags'
import SSListings from './modules/sound-store/SSListings'
import SSAudioPlayer from './modules/sound-store/SSAudioPlayer'
import SSCart from './modules/sound-store/SSCart'
import SSBeatPricingModal from './modules/sound-store/SSBeatPricingModal'
import SSBeatOfferModal from './modules/sound-store/SSBeatOfferModal'
import SSSearch from './modules/sound-store/SSSearch'
import SSFavorites from './modules/sound-store/SSFavorites'
import CuratorGenres from './modules/curator/genres'
import appVersion from './modules/AppVersion'
import orderStats from './modules/orderStats'
import MiniProfile from './modules/mini-profile/MiniProfile'
import ReleaseArtistRoles from './modules/distribution/ReleaseArtistRoles'
import App from './modules/app'

// Tell Vue to use Vuex
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: localStorage,
  reducer: (state) => ({ auth: state.auth, settings: state.settings, friendship: state.friendship, followers: state.followers, SSCart: state.SSCart })
})

export default new Vuex.Store({
  modules: {
    mediaTypes,
    auth,
    grow,
    friendRequests,
    friendship,
    dashboardStats,
    aetasks,
    erreviewers,
    ergenres,
    ercountries,
    erstates,
    ertypes,
    ersmedia,
    setProfile,
    latestShows,
    latestTracks,
    influentialConnections,
    messages,
    notifications,
    analytics,
    stripe,
    settings,
    locations,
    distribution,
    genres,
    spotify,
    curatorOrderCart,
    outlets,
    PRorderCart,
    feed,
    likes,
    reposts,
    comments,
    intent,
    feedModals,
    IPOrderCart,
    loading,
    todoList,
    search,
    hashtags,
    followers,
    SSListings,
    SSAudioPlayer,
    SSCart,
    SSBeatPricingModal,
    SSBeatOfferModal,
    SSSearch,
    SSFavorites,
    appVersion,
    orderStats,
    CuratorGenres,
    MiniProfile,
    ReleaseArtistRoles,
    App
  },
  plugins: [vuexLocalStorage.plugin]
})
