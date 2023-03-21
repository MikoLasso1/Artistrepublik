<template>
  <div>
    <blockquote class="blockquote text-center pt-0 px-0 pb-0">
      <h3>Track List</h3>
    </blockquote>
    <table class="table fixed-header table-striped">
      <thead>
      <tr>
        <th scope="col">Track Number</th>
        <th scope="col">Title</th>
        <th scope="col">Artist</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="track in tracks"
        :key="track.id"
      >
        <td>{{ track.track_number }}</td>
        <td>{{ track.track_title }}</td>
        <td>{{ track.track_primary_artist.artist_name }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    tracks: Array
  }
}
</script>
