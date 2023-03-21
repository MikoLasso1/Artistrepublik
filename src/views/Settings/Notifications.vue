<template>
  <div>
    <card
      shadow
      type="secondary"
    >
      <div
        slot="header"
        class="bg-white border-0"
      >
        <div class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">
              My account
            </h3>
          </div>
          <div class="col-4 text-right">
            <a
              href="#!"
              class="btn btn-sm btn-primary"
            >Settings</a>
          </div>
        </div>
      </div>
      <template>
        <form @submit.prevent>
          <h4 class="h6 heading-small text-muted mb-4">
            User information
          </h4>
          <div class="pl-lg-4">
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  v-model="model.username"
                  alternative=""
                  label="Username"
                  placeholder="Username"
                  input-classes="form-control-alternative"
                />
              </div>
              <div class="col-lg-6">
                <base-input
                  v-model="model.email"
                  alternative=""
                  label="Email address"
                  placeholder="jesse@example.com"
                  input-classes="form-control-alternative"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  v-model="model.firstName"
                  alternative=""
                  label="First name"
                  placeholder="First name"
                  input-classes="form-control-alternative"
                />
              </div>
              <div class="col-lg-6">
                <base-input
                  v-model="model.lastName"
                  alternative=""
                  label="Last name"
                  placeholder="Last name"
                  input-classes="form-control-alternative"
                />
              </div>
            </div>
          </div>
          <hr class="my-4">

          <h4 class="h6 heading-small text-muted mb-4">
            Contact information
          </h4>
          <div class="pl-lg-4">
            <div class="row">
              <div class="col-md-12">
                <base-input
                  v-model="model.address"
                  alternative=""
                  label="Address"
                  placeholder="Home Address"
                  input-classes="form-control-alternative"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4">
                <base-input
                  v-model="model.city"
                  alternative=""
                  label="City"
                  placeholder="City"
                  input-classes="form-control-alternative"
                />
              </div>
              <div class="col-lg-4">
                <base-input
                  v-model="model.country"
                  alternative=""
                  label="Country"
                  placeholder="Country"
                  input-classes="form-control-alternative"
                />
              </div>
              <div class="col-lg-4">
                <base-input
                  v-model="model.zipCode"
                  alternative=""
                  label="Postal code"
                  placeholder="Postal code"
                  input-classes="form-control-alternative"
                />
              </div>
            </div>
          </div>
          <hr class="my-4">

          <h4 class="h6 heading-small text-muted mb-4">
            About me
          </h4>
          <div class="pl-lg-4">
            <div class="form-group">
              <base-input
                alternative=""
                label="About Me"
              >
                <textarea
                  rows="4"
                  class="form-control form-control-alternative"
                  placeholder="A few words about you ..."
                >A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</textarea>
              </base-input>
            </div>
          </div>
        </form>
      </template>
    </card>
  </div>
</template>
<script>
export default {
  name: 'UserProfile',
  data () {
    return {
      model: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        country: '',
        zipCode: '',
        about: ''
      }
    }
  }
}
</script>
<style></style>
