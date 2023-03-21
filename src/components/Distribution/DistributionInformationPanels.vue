<template>
  <v-row>
    <v-col cols="12" class="pt-5 pb-10">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2 class="distributionsub-panel-heading">Streaming Networks</h2>
            <template v-slot:actions>
              <v-icon color="#121D3B">
                mdi-plus
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <dl class="distributionsub-panel-list-networks">
              <dd>Amazon</dd>
              <dd>Anghami</dd>
              <dd>Audiomack</dd>
              <dd>AWA</dd>
              <dd>Boomplay</dd>
              <dd>Deezer</dd>
              <dd>Facebook Audio Library (+ Instagram)</dd>
              <dd>FLO</dd>
              <dd>iHeartRadio</dd>
              <dd>iTunes/Apple Music</dd>
              <dd>Jiosaavn</dd>
              <dd>KKbox</dd>
              <dd>Mixcloud</dd>
              <dd>Music Time</dd>
              <dd>Napster / Rhapsody</dd>
              <dd>NetEase</dd>
              <dd>Nuuday</dd>
              <dd>Pandora</dd>
              <dd>Resso</dd>
              <dd>SberZvuk</dd>
              <dd>Shazam</dd>
              <dd>Snap</dd>
              <dd>Soundcloud</dd>
              <dd>Spotify</dd>
              <dd>Tencent</dd>
              <dd>Tidal</dd>
              <dd>TikTok</dd>
              <dd>Triller</dd>
              <dd>UMA</dd>
              <dd>Yandex</dd>
              <dd>YouTube Content ID</dd>
              <dd>YouTube Music</dd>
            </dl>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2 class="distributionsub-panel-heading">Distribution Requirements</h2>
            <template v-slot:actions>
              <v-icon color="#121D3B">
                mdi-plus
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <dl class="distributionsub-panel-list">
              <dt>Create an Account</dt>
              <dd>Create or log-in to your FREE Artist Republik Account.</dd>
              <dt>Song File Format</dt>
              <dd>WAV or MP3 file formats are accepted.</dd>
              <dd>16 bit (sample size) 44.1kHz (sample rate)</dd>
              <dd>We strongly reccomend uploading in WAV format only! This will give you the best sound quality on the newtworks.</dd>
              <dd>We allow MP3 format uploads, but be aware that quality loss is possible with this format.</dd>
              <dt>Promotion</dt>
              <dd>After distributing your music, you can submit your songs to playlists on Spotify to grow streams, use our Grow With Us tool to grow Spotify/SoundCloud followers, and add all of your
                socials and streaming links to your Artist Link
              </dd>
              <dt>Ownership</dt>
              <dd>YOU MUST OWN THE RIGHTS TO THE MUSIC YOU DISTRIBUTE! IF you do not own the rights OR get caught trying to use this tool to boost streams - YOUR ACCOUNT WILL BE SUSPENDED IMMEDIATELY.
                NO WARNINGS.
              </dd>
            </dl>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2 class="distributionsub-panel-heading">Distribution Label</h2>
            <template v-slot:actions>
              <v-icon color="#121D3B">
                mdi-plus
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <dl class="distributionsub-panel-list">
              <dt>Artist Republik Label</dt>
              <dd>Artist Republik distributes music through our own Artist Republik label. We are proud to provide our label to music released by independent artists from around the globe!</dd>
              <dt>Custom Label</dt>
              <dd>For a small fee, you can distribute under your own custom label - simply choose the custom label option during the distribution process.</dd>
            </dl>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2 class="distributionsub-panel-heading">Distribution Cover Art Requirements</h2>
            <template v-slot:actions>
              <v-icon color="#121D3B">
                mdi-plus
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <dl class="distributionsub-panel-list">
              <dt>Image Requirements</dt>
              <dd>Distribution networks, such as Spotify, require users to have their cover art with 3000x3000 dimensions.</dd>
              <dd>3000px x 3000px</dd>
              <dd>Must be a JPG file format (.jpg)</dd>
              <dd>No logos or other copyrighted material permitted on cover artwork.</dd>
              <dt>How can I create cover art?</dt>
              <dd>You can use free services, such as Canva.com, to resize your cover art and maintain the requirements needed OR comission art through our Graphic Design Marketplace. <span
                class="text-red"
              >*coming soon</span></dd>
            </dl>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2 class="distributionsub-panel-heading">Distribution Royalties</h2>
            <template v-slot:actions>
              <v-icon color="#121D3B">
                mdi-plus
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <dl class="distributionsub-panel-list">
              <dt>How do I receive my distribution royalties?</dt>
              <dd>You can expect to receive a payout every quarter accessible through your Distribution Dashboard. The minimum payout is $20 from your Artist Republik account.</dd>
              <dt>What type of payout will I receive?</dt>
              <dd>Payout are routed through PayPal. Connnect your PayPal account through your
                <router-link to="/settings">account settings</router-link>
                .
              </dd>
            </dl>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2 class="distributionsub-panel-heading">Distribution Release Timeline</h2>
            <template v-slot:actions>
              <v-icon color="#121D3B">
                mdi-plus
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <dl class="distributionsub-panel-list">
              <dt>How long does the distribution process take?</dt>
              <dd>Once you've submitted a song/EP/album for distribution, please allow 2 weeks for the song to go live. The music will show as "live" on the Release Date, which you select.</dd>
              <dt>Why can't I see my song yet?</dt>
              <dd>Your release date and the distribution process can effect when your song is "live" or available for view. You can view the status of your realease in the releases table of your
                distribution dashboard.
              </dd>
            </dl>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2 class="distributionsub-panel-heading">Unlimited Distribution vs. Lifetime Distribution</h2>
            <template v-slot:actions>
              <v-icon color="#121D3B">
                mdi-plus
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <dl class="distributionsub-panel-list">
              <dt>One-Time Fee for Lifetime Distribution</dt>
              <dd>Single $5.00 / Each</dd>
              <dd>EP $7.00 / Each</dd>
              <dd>Album $11.00 / Each</dd>
              <dd>You keep 100% of your royalties!</dd>
              <dd>Free ISRC and UPC</dd>
              <dt>Annual Unlimited</dt>
              <dd>$14.99 / Annual Unlimited</dd>
              <dd>Annual Fee $0</dd>
              <dd>You keep 100% of your royalties!</dd>
              <dd>Free ISRC and UPC</dd>
              <dt>After the one year subscription is over, if the plan is not renewed what happens to my songs?</dt>
              <dd>You will need to renew your yearly subscription in order to continue collecting royalties for your songs through Artist Republik. If your subscription isn’t renewed after a year,
                then your music is taken down from the stores.
              </dd>
              <dt>What if I don't want an annual subscription?</dt>
              <dd>Pay a one-time fee for each release. For the one time payment structure, the distribution is for lifetime.</dd>
            </dl>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'DistributionInformationPanels',
  data () {
    return {}
  }
}
</script>
<style>
.distributionsub-panel-list dt,
.distributionsub-panel-list dd,
.distributionsub-panel-tool dl dt,
.distributionsub-panel-tool dl dd {
  color: #121d3b;
}

@media screen and (min-width: 375px) {
  .distributionsub-panel-list-networks {
    columns: 2;
  }
}

@media screen and (min-width: 1025px) {
  .distributionsub-panel-list {
    columns: 2;
  }

  .distributionsub-panel-list-networks {
    columns: 4;
  }

  .distributionsub-panel-tools {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
