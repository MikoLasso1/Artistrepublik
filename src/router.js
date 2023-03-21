import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
import FullWidth from '@/layout/FullWidth'
import store from './store/store'
import config from '@/config'
import cookie from 'js-cookie'
import axios from 'axios'

Vue.use(Router)

// const ifNotAuthenticated = (to, from, next) => {
//   if (!store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next({ name: 'dashboard' })
// }

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  if (to.fullPath !== '/') {
    const url = to.fullPath.substring(1)
    window.location.href = config.MAIN_URL + 'login?to=' + encodeURIComponent(url)
    return
  }
  window.location.href = config.MAIN_URL + 'login'
}

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'dashboard',
      component: DashboardLayout,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          alias: '/',
          meta: {
            display: 'Dashboard',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Dashboard.vue')
        },
        {
          path: '/networking',
          name: 'networking',
          meta: {
            display: 'Networking',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Networking/index.vue')
        },
        {
          path: '/merch-dashboard',
          name: 'merch.dashboard',
          meta: {
            display: 'Merch Dashboard'
          },
          component: () => import('./views/MerchDashboard.vue')
        },
        {
          path: '/marketing-hub',
          name: 'marketing.hub',
          meta: {
            display: 'Marketing Hub',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/MarketingHub.vue')
        },
        {
          path: '/orders/stickers',
          name: 'sticker.portal',
          meta: {
            display: 'Stickers'
          },
          component: () => import('./views/StickerPortal.vue')
        },
        {
          path: '/settings',
          name: 'settings',
          meta: {
            display: 'Settings',
            helplink: 'https://support.artistrepublik.com',
            track: true
          },
          component: () => import('./views/Settings.vue')
        },
        {
          path: '/payment-methods',
          name: 'payment methods',
          meta: {
            display: 'Payment Methods',
            helplink: 'https://support.artistrepublik.com',
            track: true
          },
          component: () => import('./views/Settings/PaymentMethods.vue')
        },
        {
          path: '/messages',
          name: 'messages',
          meta: {
            display: 'Messages',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Messages.vue')
        },
        {
          path: '/trending',
          name: 'trending',
          meta: {
            display: 'Trending',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Trending.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          meta: {
            display: 'Orders',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Orders.vue')
        },
        {
          path: '/orders/reviews',
          name: 'orders.reviews',
          meta: {
            is_public: false,
            display: 'Review Orders',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/ReviewOrders.vue')
        },
        {
          path: '/orders/reviews/:uuid',
          name: 'orders.review',
          meta: {
            display: 'Review Order',
            is_public: false
          },
          component: () => import('./views/EliteReviews/OrderDetails.vue')
        },
        {
          path: '/elite-reviews/reviewer/:uuid',
          name: 'elite-reviews.reviewer',
          props: (route) => {
            const uuid = route.params.uuid || ''
            return { uuid }
          },
          meta: {
            display: 'Elite Reviewer',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/EliteReviews/ReviewerDetails.vue')
        },
        {
          path: '/subscriptions',
          name: 'subscriptions',
          meta: {
            display: 'Subscriptions',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Subscriptions.vue')
        },
        {
          path: '/logout',
          name: 'auth.logout',
          meta: {
            display: 'Logout',
            track: true
          },
          component: () => import('./views/Logout.vue')
        },
        {
          path: '/feed',
          name: 'feed',
          meta: {
            display: 'Social Feed',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Feed/SocialFeed')
        },
        {
          path: '/feed/:username',
          name: 'userFeed',
          props: true,
          meta: {
            display: 'Social Feed',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Feed/SocialFeed')
        },
        {
          path: '/tag/:hashtag',
          name: 'hashtag',
          meta: {
            display: 'Tag Viewer',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Feed/SocialFeed')
        }
        /* {
          path: "/feed/unread",
          params: { unread: true },
          name: "feed.unread",
          meta: {
            display: 'Social Feed',
            helplink: "https://support.artistrepublik.com"
          },
          component: () => import("./views/Feed/SocialFeed"),
        }, */
        /* {
          path: "/post/:id",
          name: "feed.post",
          meta: {
            display: 'Post',
            helplink: "https://support.artistrepublik.com"
          },
          component: () => import("./views/Feed/Post.vue"),
          props: true,
        }, */
      ]
    },
    {
      path: '/login-redirect',
      name: 'Login Redirect',
      component: () => import('./views/LoginRedirect.vue')
    },
    {
      path: '/shortlink/:username/:layoutId?',
      meta: {
        display: 'Mini Profile New'
      },
      component: () => import('./views/MiniProfile/MiniProfileLiveViewFront.vue')
    },
    {
      path: '/unlock',
      component: FullWidth,
      children: [
        {
          path: 'spotify',
          name: 'Unlock Spotify',
          component: () => import('./views/MiniProfile/SocialUnlockSpotify.vue')
        },
        {
          path: ':unlockId/fan/:fanId',
          name: 'Unlock Fan',
          component: () => import('./views/MiniProfile/SocialUnlock.vue')
        },
        {
          path: ':unlockId',
          name: 'Unlock Id',
          component: () => import('./views/MiniProfile/SocialUnlock.vue')
        }
      ]
    },
    {
      path: '/features',
      component: DashboardLayout,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: 'sound-store',
          name: 'sound.store.layout',
          component: () => import('./views/SoundStore/SoundStoreLayout.vue'),
          children: [
            {
              path: '/',
              name: 'sound.store',
              meta: {
                display: 'Sound Store',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStore.vue')
            },
            {
              path: 'beats',
              name: 'sound.store.beats',
              meta: {
                display: 'Beats',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreBeats.vue')
            },
            {
              path: 'cents-beats',
              name: 'sound.store.cents-beats',
              meta: {
                display: '$0.99 Beats',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreCentsBeats.vue')
            },
            {
              path: 'beat/:uuid/:featured?',
              name: 'sound.store.beat',
              meta: {
                display: 'Sound Store',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreBeat.vue')
            },
            {
              path: 'samples',
              name: 'sound.store.samplepacks',
              meta: {
                display: 'Sample Packs',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreSamplePacks.vue')
            },
            {
              path: 'sample-pack/:uuid/:featured?',
              name: 'sound.store.samplepack',
              meta: {
                display: 'Sound Store',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreSamplePack.vue')
            },
            {
              path: 'cart',
              name: 'sound.store.cart',
              meta: {
                display: 'Sound Store',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreCart.vue')
            },
            {
              path: 'manage',
              name: 'sound.store.manage',
              meta: {
                display: 'Sound Store',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreManager.vue')
            },
            {
              path: 'favorites',
              name: 'sound.store.favorites',
              meta: {
                display: 'Sound Store',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreFavorites.vue')
            },
            {
              path: ':displayName',
              name: 'sound.store.seller',
              meta: {
                display: 'Sound Store',
                helplink: 'https://support.artistrepublik.com'
              },
              component: () => import('./views/SoundStore/SoundStoreSeller.vue')
            }
          ]
        },
        {
          path: 'curator',
          name: 'features.curator',
          meta: {
            display: 'Curator',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/CuratorDashboard.vue')
        },
        {
          path: 'playlisting',
          name: 'features.playlisting',
          meta: {
            display: 'Playlisting',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Playlisting.vue')
        },
        {
          path: 'grow',
          name: 'features.gwu',
          meta: {
            display: 'Grow With Us',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/GWU.vue')
        },
        {
          path: 'distribution',
          name: 'features.distribution',
          meta: {
            display: 'Distribution',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Distribution.vue')
        },
        {
          path: 'blog-promotion',
          name: 'features.blog.promotion',
          meta: {
            display: 'PR Hub',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/PRHub.vue')
        },
        {
          path: 'blog-promotion-order',
          name: 'features.blog.promotion.order',
          meta: {
            display: 'PR Hub',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/PRHubOrder.vue')
        },
        {
          path: 'mastering',
          name: 'features.mastering',
          meta: {
            display: 'Mastering Hub',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/MasteringHub.vue')
        },
        {
          path: 'reviews',
          name: 'features.reviews',
          meta: {
            display: 'Review Hub',
            helplink: 'https://support.artistrepublik.com',
            is_public: false
          },
          component: () => import('./views/ReviewerHub.vue')
        },
        {
          path: 'press-release',
          name: 'features.blog.promotion.manager',
          meta: {
            display: 'Press Release',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/PRHub.vue')
        },
        {
          path: 'instagram-placement-order',
          name: 'features.instagram.placement.order',
          meta: {
            display: 'Instagram Placement',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/InstagramPlacementOrder.vue')
        },
        {
          path: 'instagram-placement',
          name: 'features.instagram.placement',
          meta: {
            display: 'Instagram Placement',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/InstagramPlacement.vue')
        },
        {
          path: 'reviewer-center',
          name: 'features.reviewing',
          meta: {
            display: 'Reviewer Center',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/ReviewerCenter.vue')
        },
        {
          path: 'audio-engineering',
          name: 'features.audio-engineering',
          meta: {
            display: 'Producer Center',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/ProducerCenter.vue')
        },
        {
          path: 'audio-engineering/service/:id',
          name: 'features.audio-engineering.service',
          props: (route) => {
            const id = Number.parseInt(route.params.id, 10)
            if (Number.isNaN(id)) {
              return 0
            }
            return { id }
          },
          meta: {
            display: 'Audio Engineer Service',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/AudioEngineering/ServiceDetails.vue')
        },
        {
          path: 'artist-links',
          name: 'artist.links.settings',
          meta: {
            display: 'Artist Links',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/MiniProfile/MiniProfileSettings.vue')
        },
        {
          path: 'artist-links/design',
          name: 'artist.links.design',
          meta: {
            display: 'Artist Links Design'
            // helplink: "https://info.artistrepublik.com/knowledge/marketing#artist-links"
          },
          component: () => import('./views/MiniProfile/MiniProfileDesign.vue')
        },
        {
          path: 'artist-links/my-links',
          name: 'artist.links.myLinks',
          meta: {
            display: 'Artist Links'
            // helplink: "https://info.artistrepublik.com/knowledge/marketing#artist-links"
          },
          component: () => import('./views/MiniProfile/MiniProfileMyLinks.vue')
        },
        {
          path: 'artist-links/subscription',
          name: 'artist.links.subscription',
          meta: {
            display: 'Artist Links Subscription'
            // helplink: "https://info.artistrepublik.com/knowledge/marketing#artist-links"
          },
          component: () => import('./views/MiniProfile/MiniProfileSubscription.vue')
        },
        {
          path: 'fans',
          name: 'artist.fans',
          meta: {
            display: 'My Fans',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/ArtistFans.vue')
        }
      ]
    },
    {
      path: '/register/provider/:provider',
      name: 'auth.register.provider',
      component: () => import('./views/ProviderCallback.vue')
    },
    {
      path: '/login',
      redirect: { name: 'auth.login' },
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'auth.login',
          meta: {
            display: 'Login',
            track: true
          },
          component: () => import('./views/Login.vue')
        },
        {
          path: '/404',
          name: '404',
          meta: {
            display: 'Not Found'
          },
          component: () => import('./views/404.vue')
        }
      ]
    },
    {
      path: '/',
      component: DashboardLayout,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: '/search',
          name: 'search',
          meta: {
            display: 'Search',
            helplink: 'https://support.artistrepublik.com'
          },
          component: () => import('./views/Search.vue')
        },
        {
          path: ':username',
          name: 'profile',
          component: () => import('./views/UserProfile.vue'),
          meta: {
            display: 'Profile',
            helplink: 'https://support.artistrepublik.com'
          },
          props: true
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      meta: {
        display: 'Welcome',
        track: true
      },
      component: () => import('./views/Dashboard.vue')
    }
  ],
  // eslint-disable-next-line no-unused-vars
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (
    !store.getters.isAuthenticated &&
    to.name !== 'auth.register' &&
    to.name !== 'auth.login' &&
    to.name !== 'auth.register.provider'
  ) {
    window.localStorage.setItem('register_source_page', to.name)
  }

  if (to.path === '/connect_spotify') {
    const spotifyRedirect = window.localStorage.getItem('spotify_redirect')
    window.localStorage.removeItem('spotify_redirect')
    return next({ name: spotifyRedirect, query: to.query })
  }
  next()
})

router.afterEach(async function () {
  if (cookie.get('auth._token.cookie')) {
    axios.defaults.headers.common.Authorization = cookie.get('auth._token.cookie')
  }
  try {
    let url = config.API_URL + 'v1/pixel-event'
    const queryString = ['view=true']
    if (cookie.get('_fbp')) {
      queryString.push(`_fbp=${cookie.get('_fbp')}`)
    }
    if (cookie.get('_fbc')) {
      queryString.push(`_fbc=${cookie.get('_fbc')}`)
    }
    if (queryString.length !== 0) {
      url += '?' + queryString.join('&')
    }
    const { data: { data } } = await axios.get(url)
    fbq('track', 'PageView', {}, { eventID: data.event_id })
  } catch (err) {
    console.error(err)
  }
})

router.onError((error) => {
  if (/loading chunk .* failed/i.test(error.message)) {
    window.location.reload()
  }
})

export default router
