<template>
  <div v-show="visible" class="tutorial-overlay">
    <div class="tutorial-slider">
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Welcome to Artist Republik!
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <h2 class="tutorial-heading">
            Please take a moment to review this tutorial as this platform is HUGE and has a lot of tools that can help launch your career!
          </h2>
          <div class="w-100 m-auto">
            <p class="slide-text">
              Artist Republik is a centralized digital management and social tool for Independent Music Artists across the world.
            </p>
            <p class="slide-text">
              <strong>How can Artist Republik help you?</strong>
            </p>
            <ul class="slide-start">
              <li @click="changeSlide(2)">Discover music and artists&nbsp;&nbsp;<i class="mdi mdi-chevron-double-right" aria-hidden="true" /></li>
              <li @click="changeSlide(3)">Grow your fanbase&nbsp;&nbsp;<i class="mdi mdi-chevron-double-right" aria-hidden="true" /></li>
              <li @click="changeSlide(4)">Manage your links&nbsp;&nbsp;<i class="mdi mdi-chevron-double-right" aria-hidden="true" /></li>
              <li @click="changeSlide(5)">Distribute your music&nbsp;&nbsp;<i class="mdi mdi-chevron-double-right" aria-hidden="true" /></li>
              <li @click="changeSlide(6)">Distribute your article&nbsp;&nbsp;<i class="mdi mdi-chevron-double-right" aria-hidden="true" /></li>
              <li @click="changeSlide(7)">Grow your playlist&nbsp;&nbsp;<i class="mdi mdi-chevron-double-right" aria-hidden="true" /></li>
              <li @click="changeSlide(7)">Submit your song to curators&nbsp;&nbsp;<i class="mdi mdi-chevron-double-right" aria-hidden="true" /></li>
            </ul>
          </div>
          <div>
            <div class="d-flex align-content-center m-0 py-1">
              <input v-model="neverDisplay" type="checkbox" class="tutorial-box-checkbox">
              <label class="tutorial-label">Do not show this to me again.</label>
            </div>
          </div>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1 tutorial-btn" color="red accent-4" @click="endTutorial()"> No Thanks</v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(1)">Slide to Explore the Tools&nbsp;&nbsp;<i class="mdi mdi-chevron-right" aria-hidden="true" /></v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Your Profile
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <p class="slide-text">
            This is where you show the world who you are:
          </p>
          <ul class="slide-list">
            <li>Link your Spotify</li>
            <li>Showcase Upcoming Shows</li>
            <li>Show Booking and Ticketing</li>
            <li>Grow Your Rep Score</li>
          </ul>
          <h3 class="tutorial-heading">
            What is a Rep Score?
          </h3>
          <p class="slide-text">
            The better you do - more followers, more streams, more engagements - the higher your score goes. Be careful, you also lose rep points if you are reported for violating community standards,
            spam other users, or get a bad review.
          </p>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1" color="success" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(2)">
            <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Discover
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <picture>
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/trending_mobile.webp 1x,
                /img/dashboard/tutorial/trending_mobile.webp 2x,
                /img/dashboard/tutorial/trending_mobile.webp 3x
              " type="image/webp"
            >
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/trending_mobile.png 1x,
                /img/dashboard/tutorial/trending_mobile.png 2x,
                /img/dashboard/tutorial/trending_mobile.png 3x
              " type="image/png"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/trending_mobile.webp  280w,
                /img/dashboard/tutorial/trending_desktop.webp 500w
              " type="image/webp" sizes="100vw"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/trending_mobile.png  280w,
                /img/dashboard/tutorial/trending_desktop.png 500w
              " type="image/png" sizes="100vw"
            >
            <img src="/img/dashboard/tutorial/trending_desktop.png" class="tutorial-image" alt="Discover" loading="lazy">
          </picture>
          <p class="slide-text">
            Check in to view trending music and see what other artists are working on. Discover the hottest tracks and read updates from other independent artists. The Feed gives you a format to
            communicate your acomplishments and keep your fans and collaborators in the loop and Trending charts the top 100 tracks from users across the platform.
          </p>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1" color="success" @click="changeSlide(1)">
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(3)">
            <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Grow with Us
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <picture>
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/gwu_mobile.webp 1x,
                /img/dashboard/tutorial/gwu_mobile.webp 2x,
                /img/dashboard/tutorial/gwu_mobile.webp 3x
              " type="image/webp"
            >
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/gwu_mobile.png 1x,
                /img/dashboard/tutorial/gwu_mobile.png 2x,
                /img/dashboard/tutorial/gwu_mobile.png 3x
              " type="image/png"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/gwu_mobile.webp  280w,
                /img/dashboard/tutorial/gwu_desktop.webp 500w
              " type="image/webp" sizes="100vw"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/gwu_mobile.png  280w,
                /img/dashboard/tutorial/gwu_desktop.png 500w
              " type="image/png" sizes="100vw"
            >
            <img src="/img/dashboard/tutorial/gwu_desktop.png" class="tutorial-image" alt="Marketing Hub" loading="lazy">
          </picture>
          <p class="slide-text">
            Grow your fanbase through some of the most powerful tools on the platform. The Grow With Us tool helps you utilize the power of blog and influencer marketing to grow your fanbase
            organically through gate systems. With budgets starting as low as $5, users can grow anywhere from 20 - 500+ new fans in just a couple of days! Since launching Grow With Us over 50,000 new
            followers followed our artists spotifies and playlists.
          </p>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1" color="success" @click="changeSlide(2)">
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(4)">
            <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Artist Links
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <picture>
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/artistlinks_mobile.webp 1x,
                /img/dashboard/tutorial/artistlinks_mobile.webp 2x,
                /img/dashboard/tutorial/artistlinks_mobile.webp 3x
              " type="image/webp"
            >
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/artistlinks_mobile.png 1x,
                /img/dashboard/tutorial/artistlinks_mobile.png 2x,
                /img/dashboard/tutorial/artistlinks_mobile.png 3x
              " type="image/png"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/artistlinks_mobile.webp  280w,
                /img/dashboard/tutorial/artistlinks_desktop.webp 500w
              " type="image/webp" sizes="100vw"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/artistlinks_mobile.png  280w,
                /img/dashboard/tutorial/artistlinks_desktop.png 500w
              " type="image/png" sizes="100vw"
            >
            <img src="/img/dashboard/tutorial/artistlinks_desktop.png" class="tutorial-image" alt="Artist Links" loading="lazy">
          </picture>
          <p class="slide-text">
            Instantly take your music marketing campaigns to the next level. Artist Links are shareable, trackable landing pages for your music. They allow your fans to choose where they listen or
            download your music. Artist Links are a powerful tool for music marketing that can help to grow your fanbase, increase streams and sales, and better understand your audience.
          </p>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1" color="success" @click="changeSlide(3)">
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(5)">
            <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Distribution
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <picture>
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/distribution_mobile.webp 1x,
                /img/dashboard/tutorial/distribution_mobile.webp 2x,
                /img/dashboard/tutorial/distribution_mobile.webp 3x
              " type="image/webp"
            >
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/distribution_mobile.png 1x,
                /img/dashboard/tutorial/distribution_mobile.png 2x,
                /img/dashboard/tutorial/distribution_mobile.png 3x
              " type="image/png"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/distribution_mobile.webp  280w,
                /img/dashboard/tutorial/distribution_desktop.webp 500w
              " type="image/webp" sizes="100vw"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/distribution_mobile.png  280w,
                /img/dashboard/tutorial/distribution_desktop.png 500w
              " type="image/png" sizes="100vw"
            >
            <img src="/img/dashboard/tutorial/distribution_desktop.png" class="tutorial-image" alt="distribution" loading="lazy">
          </picture>
          <p class="slide-text">
            In the menu bar you will see a distribution tab, this is where all things distribution happen. From being able to distribute to networks like spotify, apple music, amazon music, soundcloud
            and more. In this area you can also find tools like Grow With Us, Curator Hub and more that help with marketing.
          </p>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1" color="success" @click="changeSlide(4)">
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(6)">
            <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Blog Promotion
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <picture>
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/blog_mobile.webp 1x,
                /img/dashboard/tutorial/blog_mobile.webp 2x,
                /img/dashboard/tutorial/blog_mobile.webp 3x
              " type="image/webp"
            >
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/blog_mobile.png 1x,
                /img/dashboard/tutorial/blog_mobile.png 2x,
                /img/dashboard/tutorial/blog_mobile.png 3x
              " type="image/png"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/blog_mobile.webp  280w,
                /img/dashboard/tutorial/blog_desktop.webp 500w
              " type="image/webp" sizes="100vw"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/blog_mobile.png  280w,
                /img/dashboard/tutorial/blog_desktop.png 500w
              " type="image/png" sizes="100vw"
            >
            <img src="/img/dashboard/tutorial/blog_desktop.png" class="tutorial-image" alt="blog promotion" loading="lazy">
          </picture>
          <p class="slide-text">
            Submit your music/story to national blogs for Press releases across the country! Blogs are a key marketing stragtegy, they help show validity and growth! Our PR hub has dozens of industry
            blogs waiting to share your story! Increase Organic traffic, be discoverable through searches so you show up when people google you and get started on the road to being instagram verifed.
          </p>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1" color="success" @click="changeSlide(5)">
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(7)">
            <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div class="row align-items-center card-header tutorial-slide-header">
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              Curator Hub
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <picture>
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/curator_mobile.webp 1x,
                /img/dashboard/tutorial/curator_mobile.webp 2x,
                /img/dashboard/tutorial/curator_mobile.webp 3x
              " type="image/webp"
            >
            <source
              media="(max-width: 767px)"
              srcset="
                /img/dashboard/tutorial/curator_mobile.png 1x,
                /img/dashboard/tutorial/curator_mobile.png 2x,
                /img/dashboard/tutorial/curator_mobile.png 3x
              " type="image/png"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/curator_mobile.webp  280w,
                /img/dashboard/tutorial/curator_desktop.webp 500w
              " type="image/webp" sizes="100vw"
            >
            <source
              media="(min-width: 768px)"
              srcset="
                /img/dashboard/tutorial/curator_mobile.png  280w,
                /img/dashboard/tutorial/curator_desktop.png 500w
              " type="image/png" sizes="100vw"
            >
            <img src="/img/dashboard/tutorial/curator_desktop.png" class="tutorial-image" alt="curator" loading="lazy">
          </picture>
          <p class="slide-text">
            Reach industry leading curators for the opportunity to get your song on a playlist, but more importantly, to get valuable feedback on your music! Artist Republik Curator Hub offers artist
            campaigns starting at just $1 and gives the highest curator payouts in the industry. We offer artists an opportunity to grow, with access to 280,000,000 followers across playlists and
            provide a global reach for curators to discover new music and opportunities with rising artists.
          </p>
        </div>
        <section class="tutorial-buttons">
          <v-btn dark class="mx-1" color="success" @click="changeSlide(6)">
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="success" @click="changeSlide(8)">
            <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </v-btn>
        </section>
      </div>
      <div class="tutorial-slide">
        <div
          class="row align-items-center card-header tutorial-slide-header"
        >
          <div class="col text-center">
            <picture>
              <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
              <img src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
            </picture>
            <h2 class="text-uppercase ls-1 mb-1 slide-header">
              And More!
            </h2>
          </div>
        </div>
        <div class="pb-2 tutorial-slide-body">
          <p class="slide-text">
            Go explore the Republik and remember, we are all in this together.
          </p>
          <p class="slide-text">
            Visit
            <a
              href="https://info.artistrepublik.com/knowledge"
              target="_blank"
              rel="noopener"
            >help</a>
            for answers to any questions you have.
          </p>
          <div>
            <div class="d-flex align-content-center m-0 py-1">
              <input
                v-model="neverDisplay"
                type="checkbox"
                class="tutorial-box-checkbox"
              >
              <label
                class="tutorial-label"
              >Do not show this to me again.</label>
            </div>
          </div>
        </div>
        <section class="tutorial-buttons">
          <v-btn
            dark class="mx-1"
            color="success"
            @click="changeSlide(7)"
          >
            <i class="mdi mdi-chevron-left" aria-hidden="true" />
          </v-btn>
          <v-btn dark class="mx-1" color="primary" @click="changeSlide(0)">
            <i class="mdi mdi-chevron-double-left" aria-hidden="true" />
          </v-btn>
          <v-btn
            dark class="mx-1 tutorial-btn"
            color="red accent-4"
            @click="endTutorial()"
          >
            Close
          </v-btn>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      default: false
    }
  },
  data () {
    return {
      neverDisplay: false
    }
  },
  mounted () {
    this.setInitialWidth()
    this.$nextTick(function () {
      window.addEventListener('resize', this.setInitialWidth())
    })
  },
  methods: {
    endTutorial () {
      if (this.neverDisplay) {
        this.$store.dispatch('updateUserTutorial', { tutorial_show: 0 })
      }
      this.$emit('close')
    },
    changeSlide (number) {
      this.slideAction(number)
    },
    slideAction (number) {
      let changeX = document.getElementsByClassName('tutorial-slide')
      let element = document.getElementsByClassName('tutorial-slider')
      element = element[0].offsetWidth
      let offset
      let width
      let margin
      if (document.body.clientWidth <= 750) {
        offset = element * number
        width = element - element * 0.1
        margin = element / 20
      } else if (
        document.body.clientWidth > 750 &&
        document.body.clientWidth <= 2048
      ) {
        offset = (element * 0.72 - element * 0.05) * number
        width = element * 0.72 - (element / 20) * 2
        margin = (element * 0.72) / 20
      } else {
        offset = (element * 0.82 - element * 0.05) * number
        width = element * 0.82 - (element / 20) * 2
        margin = (element * 0.82) / 20
      }
      for (let i = 0; i < changeX.length; i++) {
        changeX[i].setAttribute(
          'style',
          'right: ' +
          offset +
          'px; width: ' +
          width +
          'px; margin-left: ' +
          margin +
          'px; margin-right: ' +
          margin +
          'px;'
        )
      }
    },
    setInitialWidth () {
      let changeX = document.getElementsByClassName('tutorial-slide')
      let element = document.getElementsByClassName('v-application')
      element = element[0].offsetWidth
      if (document.body.clientWidth <= 600) {
        for (let i = 0; i < changeX.length; i++) {
          changeX[i].setAttribute(
            'style',
            'width: ' + (element - element * 0.1) + 'px;'
          )
        }
      } else {
        for (let i = 0; i < changeX.length; i++) {
          changeX[i].setAttribute('style', 'width: ' + element * 0.82 + 'px;')
        }
      }
    }
  }
}
</script>
<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.tutorial-slider {
  display: flex;
  width: max-content;
  overflow-x: auto;
  height: auto;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
}

.tutorial-slider::-webkit-scrollbar {
  display: none;
  -webkit-appearance: none;
  width: 0;
}

.tutorial-slide {
  position: relative;
  right: 0;
  top: 80px;
  flex: 0 0 auto;
  border-radius: 1.375rem;
  background: white;
  margin: 0 5%;
  transition: all 0.5s ease;
  overflow-y: auto;
  padding: 20px;
  height: auto;
  width: 250px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
}

.tutorial-slide::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

.tutorial-slide::-webkit-scrollbar-track {
  background: #eae5eb;
}

.tutorial-slide::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}

.tutorial-slide-body {
  max-width: 1566px;
  margin: 0 auto;
}

.slide-header {
  font-size: 1em;
  margin: 10px 0;
  font-family: "Montserrat", sans-serif;
  color: #32325d;
}

.tutorial-heading {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
  text-align: center;
}

.tutorial-image {
  width: 75%;
  height: auto;
  max-width: 500px;
  display: block;
  margin: 20px auto;
}

.slide-text {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
  margin: 10px 0;
}

.slide-start li {
  cursor: pointer;
}

.slide-start li i {
  color: #32325d;
}

.slide-list li,
.slide-start li {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
}

.tutorial-box-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  position: relative;
  background-color: #ede2f0;
  color: #fff;
  top: -5px;
  height: 30px;
  width: 30px;
  border: 0;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-right: 7px;
  outline: none;
}

.tutorial-box-checkbox:checked::before {
  position: absolute;
  font: 13px/1 "Open Sans", sans-serif;
  left: 11px;
  top: 7px;
  content: "\02143";
  transform: rotate(40deg);
}

.tutorial-box-checkbox:hover,
.tutorial-box-checkbox:checked {
  background-color: #dbcfdf;
}

.tutorial-label {
  font-size: 0.8rem;
  color: #3d2151;
  text-transform: uppercase;
  font-family: "Montserrat-SemiBold", sans-serif;
  font-weight: 700;
}

.tutorial-buttons {
  text-align: center;
  padding: 5px 0 90px;
}

.tutorial-btn {
  margin: 5px 0;
}

.tutorial-hidden {
  display: none;
}

@media screen and (min-width: 480px) {
  .tutorial-btn {
    margin: 5px;
  }
}

@media screen and (min-width: 600px) {
  .tutorial-slide {
    margin: 10%;
  }
}

@media screen and (min-width: 640px) {
  .tutorial-slide {
    padding: 50px;
  }
}

@media screen and (min-width: 700px) {
  .tutorial-slide {
    margin: 0 3%;
  }
}

@media screen and (min-width: 768px) {
  .tutorial-overlay {
    align-items: center;
  }

  .slide-header {
    font-size: 1.25rem;
  }

  .tutorial-heading {
    font-size: 1.15rem;
    padding-top: 25px;
  }

  .tutorial-image {
    width: 100%;
  }

  .tutorial-buttons {
    padding: 5px 0;
  }

  .tutorial-btn {
    margin: 5px 10px 5px 0;
  }
}

@media screen and (min-width: 2560px) {
  .slide-header {
    font-size: 1.75rem;
  }

  .tutorial-heading {
    font-size: 1.75rem;
  }

  .slide-text {
    font-size: 1.4rem;
  }

  .slide-list li {
    font-size: 1.4rem;
  }

  .tutorial-label {
    font-size: 1.4rem;
  }

  .tutorial-box-checkbox {
    height: 45px;
    width: 45px;
  }
}
</style>
