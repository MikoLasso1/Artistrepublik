<template>
  <div>
    <base-header
      type="gradient-success"
      class="pb-6 pb-8 pt-5 pt-md-8"
    >
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <projects-table title="Light Table" />
        </div>
      </div>
      <div class="row mt-5">
        <div class="col">
          <projects-table
            type="dark"
            title="Dark Table"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectsTable from './Tables/ProjectsTable'

export default {
  name: 'Tables',
  components: {
    ProjectsTable
  }
}
</script>
<style></style>
