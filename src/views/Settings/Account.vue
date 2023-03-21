<template>
  <div>
    <card
      shadow
      type="secondary"
    >
      <template>
        <form @submit.prevent>
          <h2 class="h6 heading-small text-muted mb-4">
            User information
          </h2>
          <div class="pl-lg-4">
            <div class="row">
              <div class="col-12">
                <base-input
                  v-model="model.username"
                  alternative=""
                  label="Username"
                  placeholder="Username"
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
            <div class="row">
              <div class="col">
                <base-input
                  v-model="model.gender"
                  alternative=""
                  label="Gender"
                  placeholder=""
                  input-classes="form-control-alternative"
                >
                  <select class="form-control">
                    <option value="1">
                      Male
                    </option>
                    <option value="0">
                      Female
                    </option>
                    <option value="2">
                      Other
                    </option>
                  </select>
                </base-input>
              </div>
              <div class="col">
                <base-input
                  v-model="model.birthday"
                  alternative=""
                  label="Birthday"
                  type="date"
                  input-classes="form-control-alternative"
                />
              </div>
            </div>
          </div>
          <hr class="my-4">

          <h2 class="h6 heading-small text-muted mb-4">
            Skills
          </h2>
          <div class="pl-lg-4">
            <div class="row">
              <div class="col pl-0">
                <base-input
                  v-model="model.skills"
                  input-classes="form-control-alternative"
                  placeholder="Search for a skill"
                />
              </div>
            </div>
            <div class="row">
              <h2 class="h6 heading-small text-muted mb-4">
                Selected
              </h2>
            </div>
          </div>

          <hr class="my-4">

          <h2 class="h6 heading-small text-muted mb-4">
            About
          </h2>
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
