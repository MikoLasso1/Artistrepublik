<template>
  <div class="distribution-releases">
    <v-data-table
      v-if="releases && releases.length !== 0"
      :headers="releaseHeaders"
      :items="releases"
      :single-expand="single"
      :footer-props="footerProps"
      :sort-by="['release_date']"
      :sort-desc="[true]"
      :items-per-page="4"
      class="elevation-1 distribution-releases-table"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <h2 class="distribution-releases-heading">Your Releases</h2>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            class="distribution-draft-button"
            dark
            color="purple"
            @click="$refs.draftsModal.openModal()"
          >Drafts
          </v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:item.details="{ item }">
        <v-dialog
          max-width="550"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="white"
              elevation="0"
              icon
              v-on="on"
              v-bind="attrs"
            >
              <v-icon color="primary">
                mdi-information
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-card-title>
                <h2 class="m-0">Release Details</h2>
                <v-spacer />
                <v-btn text @click="dialog.value = false">
                  <v-icon>
                    mdi-close
                  </v-icon>
                </v-btn>
              </v-card-title>
              <v-card-subtitle>
                Draft Details
              </v-card-subtitle>
              <v-card-text>
                <dl class="distribution-releases-details">
                  <dt>Artwork</dt>
                  <dd>
                    <v-img :src="item.art_work_url" width="100" height="100" alt="order-img" class="img-thumbnail" loading="lazy" />
                  </dd>
                  <dt>Release Title</dt>
                  <dd>{{ item.release_title }}</dd>
                  <dt>Status</dt>
                  <dd>{{ item.request_delete_at ? 'Delete Requested on ' + item.request_delete_at : (item.request_edit_at ? 'Edit Requested on ' + item.request_edit_at : item.status) }}</dd>
                  <dt>Release Date</dt>
                  <dd>{{ item.release_date }}</dd>
                  <dt>Primary Artist</dt>
                  <dd v-if="item.primary_artist && item.primary_artist.artist_name">{{ item.primary_artist.artist_name }}</dd>
                  <dd v-else-if="item.primary_artist">{{ item.primary_artist }}</dd>
                  <dt>Featured</dt>
                  <dd v-if="item.secondary_artists && item.secondary_artists.length > 0">
                    {{ secondaryArtists(item) }}
                  </dd>
                  <dd v-if="item.featured_artist !== null && item.featured_artist !== ''">
                    {{ item.featured_artist }}
                  </dd>
                  <dt>Label</dt>
                  <dd>{{ item.label }}</dd>
                  <dt>Genre(s)</dt>
                  <dd>{{ item.genre }}, {{ item.sub_genre }}</dd>
                  <dt>Country</dt>
                  <dd>{{ item.release_country }}</dd>
                  <dt>Submission Date</dt>
                  <dd>{{ formatDate(item.created_at) }}</dd>
                </dl>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <template v-slot:item.status="{ item }">
        {{ item.request_delete_at ? 'Delete Requested' : (item.request_edit_at ? 'Edit Requested' : item.status) }}
      </template>
      <template v-slot:item.edit="{ item }">
        <v-btn v-if="item.request_edit_at" class="my-1" elevation="0" icon dark @click="cancelEdit(item)">
          <v-icon color="primary">
            mdi-minus-circle
          </v-icon>
        </v-btn>
        <v-btn v-else class="my-1" elevation="0" icon dark @click="$refs.editModal.openModal(item)">
          <v-icon color="primary">
            mdi-pencil
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn v-if="item.request_delete_at" class="my-1" elevation="0" icon dark @click="cancelDelete(item)">
          <v-icon color="red">
            mdi-minus-circle
          </v-icon>
        </v-btn>
        <v-btn v-else class="my-1" elevation="0" icon dark @click="$refs.deleteModal.openModal(item)">
          <v-icon color="red">
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <div v-else class="distribution-releases">
      <v-card class="distribution-releases-noreleases">
        <v-card-title>
          <h2 class="distribution-releases-heading">Your Releases</h2>
          <v-spacer></v-spacer>
          <v-btn
            class="distribution-draft-button"
            dark
            color="purple"
            @click="$refs.draftsModal.openModal()"
          >Drafts
          </v-btn
          >
        </v-card-title>
        <v-card-subtitle>
          Track Your Releases
        </v-card-subtitle>
        <v-card-text class="distribution-releases-none">
          <h3 class="distribution-releases-none-title">You have no releases.</h3>
          <picture>
            <source srcset="/img/brand/logo_dark_sm.webp" type="image/webp">
            <img class="distribution-releases-none-image" src="/img/brand/logo_dark_sm.png" alt="Artist Republik Logo" loading="lazy" />
          </picture>
        </v-card-text>
      </v-card>
    </div>
    <drafts-modal ref="draftsModal" @open-draft="openDraft($event)" />
    <confirm-resource-deletion ref="deleteModal" @after-delete="refreshReleases" />
    <confirm-resource-edit ref="editModal" @after-edit="refreshReleases" />
  </div>
</template>

<script>
import ConfirmResourceDeletion from '@/components/Distribution/Modal/ConfirmResourceDeletion'
import ConfirmResourceEdit from '@/components/Distribution/Modal/ConfirmResourceEdit'
import DraftsModal from '@/components/Distribution/Modal/DraftsModal'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  components: {
    ConfirmResourceDeletion,
    ConfirmResourceEdit,
    DraftsModal
  },
  data () {
    return {
      single: true,
      expanded: [],
      releaseHeaders: [
        {
          text: 'Release Title',
          align: 'start',
          sortable: true,
          value: 'release_title'
        },
        { text: 'Details', value: 'details' },
        { text: 'Release Date', value: 'release_date' },
        { text: 'Status', value: 'status' },
        { text: 'Streams', value: 'streams' },
        { text: 'Revenue', value: 'revenue' },
        { text: 'Edit', value: 'edit' },
        { text: 'Delete', value: 'delete' }
      ],
      footerProps: {
        'items-per-page-options': [4]
      }
    }
  },
  computed: {
    ...mapGetters({
      releases: 'getReleases'
    })
  },
  methods: {
    secondaryArtists (item) {
      let artistsArr = []
      if (item.secondary_artists && item.secondary_artists.length > 0) {
        item.secondary_artists.forEach(element => {
          artistsArr.push(element.artist_name)
        })
        return artistsArr.join(', ')
      }
      return null
    },
    openDraft (release) {
      this.$emit('open-draft', release)
    },
    formatDate (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    cancelDelete: async function (release) {
      try {
        await this.$http.post(`v1/distribution/release/${release.id}/cancel-destory?reason=none`)
      } catch (err) {
        this.throwError(err)
      }

      this.refreshReleases()
    },
    cancelEdit: async function (release) {
      try {
        await this.$http.post(`v1/distribution/release/${release.id}/cancel-edit?reason=none`)
      } catch (err) {
        this.throwError(err)
      }

      this.refreshReleases()
    },
    refreshReleases () {
      this.$store.dispatch('getReleases').then(() => {
        this.$forceUpdate()
      })
    }
  },
  mounted: function () {
    this.$store.dispatch('getReleases')
  }
}
</script>

<style lang="scss" scoped>
.distribution {
  &-releases,
  &-releases-table,
  &-releases-noreleases {
    height: 100%;
  }

  &-releases {
    &-details {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      dt, dd {
        color: #121d3b;
        flex: 0 1 50%
      }
    }

    &-none {
      padding: 3rem 0;
      text-align: center;

      &-title {
        text-transform: uppercase;
        font-weight: 300;
      }

      &-image {
        opacity: 0.5;
        max-width: 100px;
      }
    }
  }
}
</style>
<style>
.distribution-releases-table > .v-data-table__wrapper > table > tbody > tr.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
  background: white !important;
}
</style>
