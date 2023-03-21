import Vue from 'vue'

const isLayoutActive = (layoutId, planId) => {
  if (layoutId === 1) {
    return true
  } else {
    return planId > 1
  }
}
const getDefaultState = () => {
  return {
    selectedLayout: null,
    activeSetting: null,
    showLiveView: false,
    layoutData: {
      modelId: null,
      planId: null,
      selectedLayoutDb: null,
      defaultLayout: null,
      socialUnlockId: null,
      spotifyFollowButton: null,
      validPlan: false,
      customDomainName: null
    },
    defaultLayoutItems: [],
    selectLayoutItems: [],
    userLayouts: [],
    liveLayoutData: [],
    liveLayoutCompleteData: {},
    sideBarDrawer: false,
    miniSideBar: false,
    sideBarDrawerMobile: false,
    captureLiveViewProcessing: false,
    components: [
      {
        name: 'Social Links',
        component: 'MiniProfileUpdateLinksView',
        componentFE: ['BasicListenLinks', 'BasicCustomLinks'],
        componentFEalias: 'DefaultAppLogos'
      },
      {
        name: 'Social Links',
        component: 'MiniProfileUpdateLinksView',
        componentFE: 'AppLogos',
        componentFEalias: 'PremiumAppLogos'
      },
      {
        name: 'Header',
        component: 'MiniProfileHeaderType',
        componentFE: 'DefaultHeader'
      },
      {
        name: 'Header',
        component: 'MiniProfileHeaderType',
        componentFE: 'PremiumHeader'
      },
      {
        name: 'Featured Media',
        component: 'CreateFeaturedMedia',
        componentFE: 'FeaturedMedia'
      },
      {
        name: 'Stream Now',
        component: 'CreateStreamNow',
        componentFE: 'StreamNow'
      },
      {
        name: 'Embed Links',
        component: 'CreateArtistMedia',
        componentFE: 'ArtistMedia'
      },
      {
        name: 'My Shows',
        component: 'MiniProfileAllShows',
        componentFE: 'MiniProfileShowListHorizontal'
      },
      {
        name: 'My Merch',
        component: 'MiniProfileMerchandiseList',
        componentFE: 'MiniProfileMerchandiseListHorizontal'
      },
      {
        name: 'Social Unlock',
        component: 'MiniProfileSocialUnLockView',
        componentFE: 'SocialUnlock'
      },
      {
        name: 'Featured Track',
        component: 'MiniProfileTrack',
        componentFE: 'FeaturedTrack'
      },
      {
        name: 'Top Track',
        component: 'MiniProfileTopTracksCreate',
        componentFE: 'MiniProfileTopTracksList'
      },
      {
        name: 'Featured Merchandise',
        component: 'MiniProfileFeaturedMerchandiseCreate',
        componentFE: 'FeaturedMerchandise'
      },
      {
        name: 'Featured Show',
        component: 'MiniProfileFeaturedShowCreate',
        componentFE: 'FeaturedShow'
      },
      {
        name: 'Spotify Follow Button',
        component: 'MiniProfileSpotifyFollowButtonView',
        componentFE: 'MiniProfileSpotifyFollowButton'
      }
    ],
    sidebarSettingsMenu: [
      {
        title: 'Header Type',
        componentName: 'MiniProfileHeaderType',
        icon: 'mdi-alpha-h',
        color: '#ee4699'
      },
      {
        title: 'Social Links',
        componentName: 'MiniProfileUpdateLinksView',
        icon: 'mdi-account',
        color: '#00FFFF'
      },
      {
        title: 'Spotify Follow Button',
        componentName: 'MiniProfileSpotifyFollowButtonView',
        icon: 'mdi-share-variant',
        color: '#8a74b4'
      },
      {
        title: 'Stream Now',
        componentName: 'CreateStreamNow',
        icon: 'mdi-view-stream',
        color: '#a26d86'
      },
      {
        title: 'Featured Media',
        componentName: 'CreateFeaturedMedia',
        icon: 'mdi-play-network',
        color: '#00B8A9'
      },
      {
        title: 'Featured Track',
        componentName: 'MiniProfileTrack',
        icon: 'mdi-account-music-outline',
        color: '#8a74b4'
      },
      {
        title: 'Top Tracks',
        componentName: 'MiniProfileTopTracksCreate',
        icon: 'mdi-music-note-eighth',
        color: '#8a74b4'
      },
      {
        title: 'Embed Links',
        componentName: 'CreateArtistMedia',
        icon: 'mdi-music',
        color: '#775aa7'
      },
      {
        title: 'Merchandise',
        componentName: 'MiniProfileMerchandiseList',
        icon: 'mdi-alpha-m',
        color: '#8a74b4'
      },
      {
        title: 'Featured Merchandise',
        componentName: 'MiniProfileFeaturedMerchandiseCreate',
        icon: 'mdi-clipboard-list-outline',
        color: '#00ffff'
      },
      {
        title: 'Shows',
        componentName: 'MiniProfileAllShows',
        icon: 'mdi-star',
        color: '#00B8A9'
      },
      {
        title: 'Featured Show',
        componentName: 'MiniProfileFeaturedShowCreate',
        icon: 'mdi-shield-edit',
        color: 'red'
      },
      {
        title: 'Social Unlock',
        componentName: 'MiniProfileSocialUnLockView',
        icon: 'mdi-lock-open-variant-outline',
        color: '#ee4699'
      }

    ]
  }
}

const state = getDefaultState()

const getters = {
  getSelectedLayout (state) {
    return state.selectedLayout
  },
  getActiveSetting (state) {
    return state.activeSetting
  },
  getShowLiveView (state) {
    return state.showLiveView
  },
  getLiveLayoutData (state) {
    return state.liveLayoutData
  },
  getUserLayoutData (state) {
    return state.layoutData
  },
  getDefaultLayoutItems (state) {
    return state.defaultLayoutItems
  },
  getUserLayouts (state) {
    return state.userLayouts
  },
  getSelectedLayoutCompleteData (state) {
    return state.liveLayoutCompleteData
  },
  getValidPlan (state) {
    return state.layoutData.validPlan
  },
  getSocialUnlockId (state) {
    return state.layoutData.socialUnlockId
  },
  getSidebarSettingsMenu (state) {
    return state.sidebarSettingsMenu
  },
  getSideBarDrawer: function (state) {
    return state.sideBarDrawer
  },
  getSideBarDrawerMobile: function (state) {
    return state.sideBarDrawerMobile
  },
  getSideBarMini: function (state) {
    return state.miniSideBar
  },
  getCaptureLiveView: function (state) {
    return state.captureLiveViewProcessing
  }
}

const mutations = {
  SET_SELECTED_LAYOUT (state, layoutId) {
    state.selectedLayout = layoutId
  },
  SET_ACTIVE_SETTING (state, setting) {
    state.activeSetting = setting
  },
  SET_SHOW_LIVE_VIEW (state, data) {
    state.showLiveView = data
  },
  SET_LIVE_LAYOUT_DATA (state, data) {
    state.liveLayoutData = data
  },
  SET_USER_LAYOUTS (state, data) {
    state.userLayouts = data
  },
  SET_LIVE_LAYOUT_COMPLETE_DATA (state, data) {
    state.liveLayoutCompleteData = data
    if (data.hasOwnProperty('data')) {
      state.liveLayoutData = JSON.parse(data.data)
    }
  },
  SET_SOCIAL_UNLOCK_ID (state, data) {
    state.layoutData.socialUnlockId = data
  },
  UPDATE_LAYOUT_COVER_BG (state, data) {
    const layoutId = data.layout_id

    const layoutIndex = state.userLayouts.findIndex(i => {
      return i.id === layoutId
    })

    state.userLayouts[layoutIndex].cover_type = data.cover_type
    state.userLayouts[layoutIndex].cover_bg_color = data.cover_bg_color
    state.userLayouts[layoutIndex].cover_bg_image = data.cover_bg_image
  },
  ADD_COMPONENT (state, { componentName, componentFE = null, componentFEalias = null }) {
    console.log('ADD_COMPONENT', componentName, componentFE, componentFEalias)
    let selectedComponent
    if (componentFEalias) {
      // in case we have 2 diff layouts for one BE component, e.g MiniProfileUpdateLinksView
      const alreadyAdded = state.liveLayoutData.findIndex(i => {
        return i.component === componentName
      })

      // for this componentFEalias get componentFE
      const componentFromAlias = state.components.filter(
        v => v.componentFEalias === componentFEalias
      )[0]

      if (alreadyAdded !== -1) {
        state.liveLayoutData[alreadyAdded].componentFE = componentFromAlias.componentFE
        state.liveLayoutData[alreadyAdded].componentFEalias = componentFEalias
      }
    } else if (componentFE) {
      // in case we are using more than 1 FE components for one BE component, e.g MiniProfileHeaderType
      const headerAlreadyAdded = state.liveLayoutData.findIndex(i => {
        return i.component === componentName
      })

      if (headerAlreadyAdded !== -1) {
        state.liveLayoutData[headerAlreadyAdded].componentFE = componentFE
      }
    }

    selectedComponent = state.components.filter(
      v => v.component === componentName
    )[0]

    // check if live view already has this component
    const componentAlready = state.liveLayoutData.filter(v => v.component === componentName)

    if (componentAlready.length === 0) {
      const componentData = {
        component: selectedComponent.component,
        componentFE: selectedComponent.componentFE,
        componentFEalias: selectedComponent.componentFEalias ? selectedComponent.componentFEalias : null,
        name: selectedComponent.name
      }

      if (componentName === 'MiniProfileHeaderType') {
        state.liveLayoutData = [componentData, ...state.liveLayoutData]
      } else {
        state.liveLayoutData.push(componentData)
      }
    }

    state.activeSetting = selectedComponent.component
  },

  REMOVE_COMPONENT (state, componentName) {
    state.liveLayoutData.splice(state.liveLayoutData.findIndex(i => {
      return i.component === componentName
    }), 1)
  },
  SET_USER_DEFAULT_LAYOUT (state, data) {
    state.layoutData.defaultLayout = data
  },
  SET_USER_LAYOUT_DATA (state, data) {
    state.layoutData.modelId = data.mini_profile_id
    state.layoutData.planId = data.plan_id
    state.layoutData.selectedLayoutDb = data.selected_layout
    state.layoutData.defaultLayout = data.default_layout
    state.layoutData.socialUnlockId = data.social_unlock_id
    state.layoutData.spotifyFollowButton = data.enable_follow_spotify
    state.layoutData.customDomainName = data.custom_domain_name
    if (data.plan_id || data.mini_profile_id) {
      state.layoutData.validPlan = true
    }
  },
  SET_LAYOUT_DATA (state, layouts) {
    const layoutItems = []
    const planId = state.layoutData.planId

    layouts.forEach((layout) => {
      const layoutInfo = {
        layoutName: layout.name,
        id: layout.id,
        data: layout.data,
        disabled: !isLayoutActive(layout.id, planId)
      }
      layoutItems.push(layoutInfo)
    })

    // add empty template to layouts
    layoutItems.push({
      layoutName: 'Blank Layout',
      id: 9999,
      data: '[]',
      disabled: planId <= 1
    })

    // this var is used for "Select Layout To Edit"
    state.selectLayoutItems = layoutItems

    // this var is used for "Choose which layout your link will show"
    state.defaultLayoutItems = layoutItems
  },
  SET_SIDEBAR_DRAWER: function (state, data) {
    state.sideBarDrawer = data
  },
  SET_SIDEBAR_DRAWER_MOBILE: function (state, data) {
    state.sideBarDrawerMobile = data
  },
  SET_SIDEBAR_MINI: function (state, data) {
    state.miniSideBar = data
  },
  SET_CAPTURE_LIVE_VIEW: function (state, data) {
    state.captureLiveViewProcessing = data
  },
  SET_SELECTED_LAYOUT_DATA: function (state, layout) {
    state.selectedLayout = layout.id
    state.liveLayoutCompleteData = layout
    state.liveLayoutData = JSON.parse(layout.data)
    state.activeSetting = 'MiniProfileHeaderType'
  }
}

const actions = {
  getPlan ({ commit, dispatch }, username) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/user/mini-profile/layout', {
        params: { username: username }
      }).then(res => {
        if (res.status === 200) {
          const layoutResponseData = res.data.data
          commit('SET_USER_LAYOUT_DATA', layoutResponseData)
          dispatch('getLayouts')
          dispatch('getUserLayouts')
        }
        resolve(res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  userMiniProfile ({ commit }, username) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/user/mini-profile/layout', {
        params: { username: username }
      })
        .then(res => {
          if (res.status === 200) {
            const layoutResponseData = res.data.data
            commit('SET_USER_LAYOUT_DATA', layoutResponseData)
          }
          resolve(res.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getLayouts ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get(
          'v1/mini-profile/layouts'
        )
        .then(res => {
          const layouts = res.data.data
          commit('SET_LAYOUT_DATA', layouts)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUserLayouts ({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http.get('v1/user/mini-profile/user-layout').then(res => {
        const layouts = res.data.data
        commit('SET_USER_LAYOUTS', layouts)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  createLayout ({ commit }, { layoutId, layoutName, layoutData }) {
    return new Promise((resolve, reject) => {
      Vue.$http.post('v1/user/mini-profile/user-layout', {
        id: layoutId,
        name: layoutName,
        data: layoutData
      }).then(res => {
        const layout = res.data.id
        commit('SET_SELECTED_LAYOUT', layout)
        commit('SET_LIVE_LAYOUT_COMPLETE_DATA', res.data)
        commit('SET_LIVE_LAYOUT_DATA', JSON.parse(layoutData))
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateLayout ({ state }, data) {
    const selectedLayout = state.selectedLayout
    return new Promise((resolve, reject) => {
      Vue.$http.put(`v1/user/mini-profile/user-layout/${selectedLayout}`, {
        name: data.name,
        data: JSON.stringify(data.layoutData)
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteLayout ({ commit }, layoutId) {
    return new Promise((resolve, reject) => {
      Vue.$http.delete(`v1/user/mini-profile/user-layout/${layoutId}`)
        .then(res => {
          commit('SET_SELECTED_LAYOUT', null)
          commit('SET_LIVE_LAYOUT_COMPLETE_DATA', {})
          commit('SET_LIVE_LAYOUT_DATA', [])
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
