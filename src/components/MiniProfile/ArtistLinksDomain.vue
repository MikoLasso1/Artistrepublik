<template>
  <div
    class="artstlnksdomain"
    :style="bgStyle"
    :class="{'p-0': isAdmin}"
  >
    <v-container fluid>
      <v-row :class="{'mb-3 mb-lg-4': !isAdmin}">
        <v-col
          cols="12"
          class="text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h2
            :class="{ 'artstlnksdomain-title-dark': dark, 'artstlnksdomain-title-admin': isAdmin, 'mb-0': isAdmin }"
            class="artstlnksdomain-title"
          >
            <slot name="title"></slot>
          </h2>
        </v-col>
      </v-row>
      <v-row class="mb-3 mb-lg-4">
        <v-col
          cols="12"
          class="text-center artstlnksdomain-container"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          <div
            class="artstlnksdomain-input"
          >
            <v-form
              ref="form"
              v-model="valid"
              v-on:submit.prevent="sendUrlString"
            >
              <v-text-field
                :autofocus="active"
                prefix="artstlnk.com/"
                label="yourname"
                hint="Enter your preferred domain"
                v-model="customDomainName"
                :rules="urlStringRule"
                :loading="processing"
                @keyup.enter="sendUrlString"
              />

              <v-alert
                border="right"
                colored-border
                type="error"
                elevation="2"
                class="mt-2"
                v-if="alreadyTaken"
              >
                This domain name is already taken. Please try another.
              </v-alert>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: 'artist-links'
    },
    imgName: {
      type: String,
      default: 'artstlnksdomain'
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      background: this.imgName,
      processing: false,
      valid: false,
      urlString: null,
      urlStringRule: [
        v => !!v || 'Enter your preferred domain',
        v => /^[a-zA-Z0-9_-]+$/u.test(v) || 'Domain must contain only A-Z, 0-9, -, or _.'
      ],
      alreadyTaken: false
    }
  },
  methods: {
    ...mapActions({
      userMiniProfile: 'MiniProfile/userMiniProfile'
    }),
    getBG () {
      switch (true) {
        case window.document.body.clientWidth < 600:
          this.background = this.imgName + '_sm'
          break
        case window.document.body.clientWidth < 768:
          this.background = this.imgName + '_md'
          break
        case window.document.body.clientWidth <= 2140:
          this.background = this.imgName
          break
        case window.document.body.clientWidth > 2140:
          this.background = this.imgName + '_xl'
          break
      }
    },
    debounceMethod: _.debounce(function () {
      this.sendUrlString()
    }, 1000),

    async sendUrlString () {
      this.$refs.form.validate()
      if (this.valid) {
        //check if custom_domain name is available
        this.alreadyTaken = false
        this.makeCall = true

        console.log(this.isAdmin, this.userLayoutData.customDomainName, this.urlString)
        if (this.urlString === null) {
          this.makeCall = false
        } else {
          this.makeCall = !((this.isAdmin) && (this.userLayoutData.customDomainName === this.urlString));
        }

        if (this.makeCall) {
          this.processing = true
          try {
            let response = await Vue.$http.get(`v1/user/mini-profile/is-domain-available`, {
              params: {
                custom_domain_name: this.urlString
              }
            })
            // console.log(response);
            if (response.status === 200) {
              if (this.isAdmin) {
                //update custom domain name
                this.updateUserCustomDomainName()
              } else {
                this.$emit('start', this.urlString)
                this.processing = false
              }
            }
          } catch (error) {
            if (error.response.status === 403) {
              this.alreadyTaken = true
              this.$emit('start', false)
            } else {
              this.$noty.warning('Error Occurred while processing request.')
            }
            this.processing = false
          }
        }
      }
    },
    async updateUserCustomDomainName () {
      try {
        await Vue.$http.put(`v1/user/mini-profile/layout/${this.userLayoutData.modelId}`, {
          custom_domain_name: this.urlString
        })
        this.userMiniProfile(this.username)
        this.$noty.success('Domain name udpated successfully.')
      } catch (error) {
        console.log(error)
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processing = false
    }
  },
  computed: {
    ...mapGetters({
      userLayoutData: 'MiniProfile/getUserLayoutData'
    }),
    bgStyle () {
      if (!this.isAdmin) {
        return `background-image: url(/img/` +
          this.path +
          `/` +
          this.background +
          `.png);background-image: url(/img/` +
          this.path +
          `/` +
          this.background +
          `.webp);`
      } else {
        return ''
      }
    },
    customDomainName: {
      get () {
        if (this.isAdmin) {
          return this.userLayoutData.customDomainName ? this.userLayoutData.customDomainName : this.username
        } else {
          return ''
        }
      },
      set (newVal) {
        this.urlString = newVal
        this.debounceMethod()
      }
    }
  },
  beforeMount () {
    this.getBG()
  }
}
</script>
<style lang="scss" scoped>


.artstlnksdomain {
  background-position: top left;
  background-size: 65%;
  background-repeat: no-repeat;
  max-width: 2560px;

  &-title {
    font-size: 30px;
    font-weight: bold;
    color: #121d3b;
    font-family: "LeagueSpartan-Bold", sans-serif;

    &-dark {
      color: #121d3b;
    }
  }

  &-title-admin {
    font-size: 25px !important;
  }

  &-input {
    border: 6px solid #cc3379;
    border-radius: 25px;
    margin: 0 auto;
    padding: 20px 12px;
    position: relative;
    text-align: center;
    max-width: 300px;
    font-family: "LeagueSpartan-Bold", sans-serif;
    color: #121d3b;

    &:before {
      content: "";
      background: white;
      width: 32px;
      height: 8px;
      font-weight: 300;
      top: -7px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    &:after {
      content: "";
      background: white;
      width: 32px;
      height: 8px;
      font-weight: 300;
      bottom: -7px;
      position: absolute;
      right: 20%;
    }
  }

  &-heading {
    font-family: "LeagueSpartan-Bold", sans-serif;
    border: 6px solid #cc3379;
    border-radius: 25px;
    color: #121d3b;
    width: max-content;
    margin: 0 auto;
    padding: 20px 12px;
    font-size: 1.3em;
    position: relative;
    text-align: center;
    max-width: 530px;

    &:before {
      content: "";
      background: white;
      width: 32px;
      height: 8px;
      font-weight: 300;
      top: -7px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    &:after {
      content: "";
      background: white;
      width: 32px;
      height: 8px;
      font-weight: 300;
      bottom: -7px;
      position: absolute;
      right: 20%;
    }
  }

  &-accent {
    color: #a6a6a6;
  }

  &-container {
    margin: 0 auto;
  }

  @media screen and (min-width: 375px) {
    &-heading {
      padding: 20px;
      font-size: 1.5em;
    }
    &-input {
      max-width: 350px;
    }
  }
  @media screen and (min-width: 600px) {
    &-input {
      width: max-content;
    }
  }
  @media screen and (min-width: 768px) {
    background-position: center left;
    background-size: cover;
    background-repeat: no-repeat;
  }
  @media screen and (min-width: 960px) {
    padding: 20px 0;
    &-input {
      min-width: 324px;
    }
    &-heading {
      min-width: 324px;
    }
  }
  @media screen and (min-width: 1264px) {
    padding: 80px 0 0;
    margin: 0 auto;
    background-size: 85%;
    &-input {
      min-width: 250px;
    }
    &-heading {
      min-width: 250px;
    }
  }
  @media screen and (min-width: 1600px) {
    &-title {
      font-size: 50px;
    }
    &-input {
      padding: 20px 70px;
      min-width: 385px;
      max-width: 530px;

      &:before,
      &:after {
        width: 80px;
      }
    }
    &-heading {
      font-size: 30px;
      padding: 20px 70px;
      min-width: 385px;

      &:before,
      &:after {
        width: 80px;
      }
    }
  }
  @media screen and (min-width: 2000px) {
    background-size: contain;
  }
}
</style>
<style lang="scss">
.artstlnksdomain {
  &-input {
    .v-text-field {
      padding-top: 0;
      margin-top: 0;

      div.v-input__control {
        > div.v-input__slot {
          margin: 0;

          &:before {
            border-color: transparent;
          }

          div.v-text-field__prefix {
            color: #121d3b;
            font-family: "LeagueSpartan-Bold", sans-serif;
            font-size: 1.3em;
          }

          div.v-text-field__slot {
            flex: 0 1 auto;
            flex: 0 1 auto;

            .v-label {
              font-family: "LeagueSpartan-Bold", sans-serif;
              color: #a6a6a6;
              font-size: inherit;
            }

            .v-label.v-label--active {
              font-size: 18px;
            }
          }
        }

        > div.v-text-field__details {
          min-height: 0px;

          > .v-messages.theme--light {
            min-height: 0px;
          }
        }
      }

      &.v-input--is-focused {
        div.v-input__control {
          .v-text-field__details {
            .v-messages {
              .v-messages__wrapper {
                padding-top: 7px;
              }
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 375px) {
    &-input {
      .v-text-field {
        div.v-input__control {
          > div.v-input__slot {
            div.v-text-field__slot {
              div.v-text-field__prefix {
                font-size: 1.5em;
              }

              .v-label {
                font-size: 1.5em;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (min-width: 1600px) {
    &-input {
      .v-text-field {
        div.v-input__control {
          > div.v-input__slot {
            div.v-text-field__slot {
              div.v-text-field__prefix {
                font-size: 30px;
              }

              .v-label {
                font-size: 30px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
