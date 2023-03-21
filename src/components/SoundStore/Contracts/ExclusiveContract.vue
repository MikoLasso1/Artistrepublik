<template>
  <div>
    <h4 style="text-align: center;">Exclusive Rights</h4>
    <br />
    <br />
    <p>
      Agreement made between <strong>Your Name</strong> (hereinafter referred to as “ARTIST”), AND <strong>Producer name</strong>
      (hereinafter referred to as “PRODUCER”), and effective on {{ todayDate }}.
    </p>
    <br />
    <p>
      The Purpose of this Agreement is for Producer to: Grant Artist EXCLUSIVE Rights to the following Beat(s)
      produced and legally owned by Producer.
    </p>
    <br />
    <br />
    <p><strong>Exclusive Rights</strong></p>
    <br />
    <p>
      {{ beat.name }}
      <br />
      {{ pricing.download_types ? pricing.download_types.join(',') : `All Available Formats` }}
    </p>
    <br />
    <br />
    <p>
      I, PRODUCER, <strong>Producer Name</strong>, Acknowledge receipt of Artist’s FULL Payment of ALL the exclusive rights to the
      beat(s) above. Producer grants Artist the Rights to:
    </p>
    <ol>
      <li>
        Record “Music” containing in whole or in part the Beat(s)
      </li>
      <li>
        Mix, master, rearrange, or re-engineer in whole or in part the Beat(s)
      </li>
      <li>
        Publish Music in any and all parts of the world (includes Internet downloads)
      </li>
      <li>
        Distribute Music in any and all parts of the world (includes Internet downloads)
      </li>
      <li>
        Perform or broadcast Music in any and all parts of the world
      </li>
      <li>
        Grant other non-exclusive licenses to the Beat(s) to third parties
      </li>
      <li>
        Have a third party perform the Rights mentioned herein
      </li>
      <li>
        Make money related in whole or in part to the Music through any and all ways except when granting
        other non-exclusive licenses to the Beat(s)
      </li>
    </ol>
    <br />
    <br />
    <p><strong>Producer Obligates Artist/Record label to:</strong></p>
    <ol>
      <li>
        Give Producer "Credit" as the composer and producer of the Beat(s) in all situations where the Music is
        credited, distributed, published, broadcast, or performed. For all websites, the Credit must read
        "Produced by <strong>Producer Name</strong>".
      </li>
      <li>
        OPTIONALLY E-Mail Producer at no cost one a copy of the Music within one (1) month of the Music’s publishing.
      </li>
      <li>
        NOT RESELL THE BEAT(S) which the Artist bought EXCLUSIVE RIGHTS from Producer
      </li>
      <li>
        CLEARANCE for ANY SAMPLE used in the beats composed by the producer which makes the Artist/Record Label;
        responsible for sample clearance.
      </li>
      <li>
        Return of a copy of the completely filled, and signed contract to the producer for legal records
      </li>
    </ol>
    <br />
    <br />
    <p><strong>The following rights, obligations, and acknowledgements concern the Producer.</strong></p>
    <ol>
      <li>
        Has any other rights relating directly or indirectly to the Beat(s) that are not in violation of anything
        stated in this Agreement.
      </li>
      <li>
        Is obligated to send Artist the Beat(s) by mp3 OR WAV FILES.
      </li>
      <li>
        Is obligated to remove the Beat(s) from internet broadcast (i.e., Producer’s websites)
      </li>
      <li>
        Acknowledge receipt of Artist’s Payment
      </li>
      <li>
        Give no refunds
      </li>
    </ol>
    <br />
    <br />
    <p><strong>General:</strong></p>
    <br />
    <p>
      This Agreement shall be governed by and interpreted in accordance with the laws of the State/Provence of
      <strong>Producer Provence</strong>. Place of jurisdiction shall be <strong>Producer Provence</strong> for any possible dispute, suit, or
      litigation arising from this Agreement.
      <br />
      Artist is bound to this Agreement by Artist’s Payment to Producer. Artist’s Payment is kept in Producer’s records.
      <br />
      Producer is bound to this Agreement by Artist’s Payment to Producer. Artist’s Payment is kept in Producer’s records.
      <br />
      Artist and Producer understand that the production of Beat(s) is work-made-for-hire under
      U.S. Copyright Act of 1976 (17 U.S.C. sec.101).
    </p>
    <hr>
    <p>
      Producer is bound to this Agreement by Producer’s e-signature equivalent of uploading and agreeing to this
      contract through the terms and conditions of the Artist Republik Platform and by clicking the “Agree”
      button prior to uploading the beat.
    </p>
    <br />
    <br />
    <p>
      Artist is bound to this Agreement by Artist’s e-signiture which is the equivalent of purchasing the beat
      through Artist Republik and clicking “agree” on the checkbox prior to purchasing.
    </p>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    beat: Object,
    pricing: Object
  },
  computed: {
    todayDate: function () {
      return moment().format('MM/DD/YYYY')
    }
  }
}
</script>

<style lang="scss" scoped>
strong {
  font-weight: bold;
}
</style>
