<template>
  <div>
    <p>
      This Non-Exclusive {{ pricing.download_types.join(',') }} License Agreement (the “Agreement”), having been made on and effective as of {{ todayDate }}
      (the “Effective Date”) by and between <strong>Producers Name</strong> p/k/a <strong>Producers Name</strong>; (the “Producer” or “Licensor”); and <strong>Your Name</strong> residing at
      <strong>Your Address</strong> (“You” or “Licensee”), sets forth the terms and conditions of the Licensee's use, and the
      rights granted in, the Producer's instrumental music file entitled {{ beat.name }} (the “Beat”) in consideration for
      Licensee's payment of <strong>$</strong> (the “License Fee”), on a so-called “{Lease Classification}” basis.
    </p>
    <br />
    <br />
    <p>
      The following Licensing Agreement is issued in connection with and for the Licensee's use of the Beat pursuant and subject
      to all of the following terms and conditions set forth herein.
    </p>
    <br />
    <br />
    <p>
      1. <strong>License Fee:</strong> The Licensee shall make payment of the License Fee to Licensor on the date of this Agreement.
      All rights granted to Licensee by the Producer in the Beat are conditional upon Licensee's timely
      payment of the License Fee. The License Fee is a one-time payment for the rights granted to Licensee and this
      Agreement is not valid until the License Fee has been paid.
    </p>
    <br />
    <br />
    <p>1. <strong>Delivery of the Beat:</strong></p>
    <ol>
      <li>
        Licensor agrees to deliver the Beat as a high quality {{ pricing.download_types.join(',') }},
        as such terms are understood in the music industry.
      </li>
      <li>
        Licensor shall use commercially reasonable efforts to deliver the Beat to Licensee immediately,
        through the Artist Republik Sound Store, after payment of the License Fee is made. Licensee will
        receive the Beat via the Artist Republik Sound Store and Via email from Artist Republik on behalf of the Licensor.
      </li>
    </ol>
    <br />
    <br />
    <p>
      1. <strong>Term:</strong> The Term of this Agreement shall be ten (10) years and this license shall expire on the
      ten (10) year anniversary of the Effective Date.
    </p>
    <br />
    <br />
    <p>1. <strong>Use of the Beat:</strong></p>
    <ol>
      <li>
        In consideration for Licensee's payment of the License Fee, the Producer hereby grants Licensee a limited
        non-exclusive, nontransferable license and the right to incorporate, include and/or use the Beat in the preparation
        of one (1) new song or to incorporate the Beat into a new piece of instrumental music created by the Licensee.
        Licensee may create the new song or new instrumental music by recording his/her written lyrics over the Beat and/or
        by incorporating portions/samples of the Beat into pre-existing instrumental music written, produced and/or owned by
        Licensee. The new song or piece of instrumental music created by the Licensee which incorporates some or all of the
        Beat shall be referred to as the “New Song”. Permission is granted to Licensee to modify the arrangement, length,
        tempo, or pitch of the Beat in preparation of the New Song for public release.
      </li>
      <li>
        This License grants Licensee a worldwide, non-exclusive license to use the Beat as incorporated in the
        New Song in the manners and for the purposes expressly provided for herein, subject to the sale restrictions,
        limitations and prohibited uses stated in this Agreement. Licensee acknowledges and agrees that any and all
        rights granted to Licensee in the Beat pursuant to this Agreement are on a NON-EXCLUSIVE basis and Producer
        shall continue to license the Beat upon the same or similar terms and conditions as this Agreement to other
        potential third- party licensees.
      </li>
    </ol>
    <br />
    <br />
    <p>
      The New Song may be used for any promotional purposes, including but not limited to, a release in single format,
      for inclusion in a mixtape or free compilation of music bundled together (EP or album), and/or promotional,
      non-monetized digital streaming;
    </p>
    <br />
    <br />
    <p>
      Licensee {{ pricing.for_profit_performances ? 'may' : 'may not' }} perform the song publicly for-profit performances,
      including but not limited to, at a live performance (i.e. concert, festival, nightclub etc.), on terrestrial or satellite radio,
      and/or on the internet via third party streaming services (Spotify, YouTube, iTunes Radio etc.).
      The New Song may be played on {#) terrestrial or satellite radio stations; If the New Song Receives more than 400k streams across all
      streaming platforms, including radio, the artist agrees to pay 15% of all royalties received to Artist Republik, inc as apart of this licensing agreement.
    </p>
    <br />
    <br />
    <p>
      The Licensee may use the New Song in synchronization with {{ music_video_number }} ({{ pricing.music_videos }})
      audiovisual work no longer than five (5) minutes in length (a “Video”). In the event that the New Song itself is longer
      than five (5) minutes in length, the Video may not play for longer than the length of the New Song.
      The Video may be broadcast on any television network and/or uploaded to the internet for digital streaming and/or
      free download by the public including but not limited to on YouTube and/or Vevo. Producer grants no other synchronization rights to Licensee;
    </p>
    <br />
    <br />
    <p>
      The Licensee may make the New Song available for sale in physical and/or digital form and
      sell {{ pricing.distribute_amount }} downloads/physical music products and are allowed {{ pricing.online_streams }} streams.
      The New Song may be available for sale as a single and/or included in a compilation of other songs bundled
      together by Licensee as an EP or a full-length Album. The New Song may be sold via digital retailers for
      permanent digital download in mp3 format and/or physical format, including compact disc and vinyl records.
      For clarity and avoidance of doubt, the Licensee does NOT have the right to sell the Beat in the form that it was
      delivered to Licensee. The Licensee must create a New Song (or instrumental as detailed above) for its rights under
      this provision to vest. Any sale of the Beat in its original form by Licensee shall be a material breach of this
      Agreement and the Licensee shall be liable to the Licensor for damages as provided hereunder.
    </p>
    <br />
    <br />
    <p>
      1. Subject to the Licensee's compliance with the terms and conditions of this Agreement, Licensee shall not
      be required to account or pay to Producer any royalties, fees, or monies paid to or collected by the Licensee
      (expressly excluding mechanical royalties), or which would otherwise be payable to Producer in connection with
      the use/exploitation of the New Song as set forth in this Agreement.
    </p>
    <br />
    <br />
    <p>
      1. <strong>Restrictions on the Use of the Beat:</strong> Licensee hereby agrees and acknowledges that it is
      expressly prohibited from taking any action(s) and from engaging in any use of the Beat or New Song in the manners,
      or for the purposes, set forth below:
    </p>
    <ol>
      <li>
        The rights granted to Licensee are <strong>NON-TRANSFERABLE</strong> and that Licensee may not transfer or
        assign any of its rights hereunder to any third-party;
      </li>
      <li>
        Licensee shall not synchronize, or permit third parties to synchronize, the Beat or New Song with any
        audiovisual works EXCEPT as expressly provided for and pursuant to Paragraph 4(b)(iii) of this Agreement
        for use in {{ music_video_number }} ({{ pricing.music_videos }}) Video. This restriction includes, but is not limited to, use of the Beat and/or New Song
        in television, commercials, film/movies, theatrical works, video games, and in any other form on the Internet
        which is not expressly permitted herein
      </li>
      <li>
        Licensee shall not have the right to license or sublicense any use of the Beat or of the New Song,
        in whole or in part, for any so-called “samples”.
      </li>
      <li>
        Licensee shall not engage in any unlawful copying, streaming, duplicating, selling, lending, renting, hiring,
        broadcasting, uploading, or downloading to any database, servers, computers, peer to peer sharing,
        or other file sharing services, posting on websites, or distribution of the Beat in the form, or a
        substantially similar form, as delivered to Licensee. Licensee may send the Beat file to any individual musician,
        engineer, studio manager or other person who is working on the New Song.
      </li>
      <li>
        THE LICENSEE IS EXPRESSLY PROHIBITED FROM REGISTERING THE BEAT AND/OR NEW SONG WITH ANY CONTENT
        IDENTIFICATION SYSTEM, SERVICE PROVIDER, MUSIC DISTRIBUTOR, RECORD LABEL OR DIGITAL AGGREGATOR
        (for example: TuneCore or CDBaby, and any other provider of user-generated content identification services).
        The purpose of this restriction is to prevent you from receiving a copyright infringement take down notice from a
        third party who also received a non-exclusive license to use the Beat in a New Song.
        The Beat has already been tagged for Content Identification (as that term is used in the music industry)
        by Producer as a pre-emptive measure to protect all interested parties in the New Song.
        If you do not adhere to this policy, you are in violation of the terms of this License and your license to use
        the Beat and/or New Song may be revoked without notice or compensation to you.
      </li>
      <li>
        As applicable to both the underlying composition in the Beat and to the master recording of the Beat:
        (i) The parties acknowledge and agree that the New Song is a “derivative work”, as that term is used in the
        United States Copyright Act; (ii) As applicable to the Beat and/or the New Song, there is no intention by
        the parties to create a joint work; and (iii) There is no intention by the Licensor to grant any rights in
        and/or to any other derivative works that may have been created by other third-party licensees.
      </li>
    </ol>
    <br />
    <br />
    <p>1. <strong>Ownership:</strong></p>
    <br />
    <br />
    <p>1. The Producer is and shall remain the sole owner and holder of all right, title, and interest in the</p>
    <br />
    <br />
    <p>
      Beat, including all copyrights to and in the sound recording and the underlying musical compositions written and
      composed by Producer. Nothing contained herein shall constitute an assignment by Producer to Licensee of any of the
      foregoing rights. Licensee may not, under any circumstances, register or attempt to register the New Song and/or the
      Beat with the U.S. Copyright Office. The aforementioned right to register the New Song and/or the Beat shall be
      strictly limited to Producer. Licensee will, upon request, execute, acknowledge and deliver to Producer such
      additional documents as Producer may deem necessary to evidence and
    </p>
    <br />
    <br />
    <p>
      effectuate Producer's rights hereunder, and Licensee hereby grants to Producer the right as attorney-in-fact to execute,
      acknowledge, deliver and record in the U.S. Copyright Office or elsewhere any and all such documents if Licensee
      shall fail to execute same within five (5) days after so requested by Producer.
    </p>
    <br />
    <br />
    <p>
      2. For the avoidance of doubt, you do not own the master or the sound recording rights in the New Song.
      You have been licensed the right to use the Beat in the New Song and to commercially exploit the New Song
      based on the terms and conditions of this Agreement.
    </p>
    <br />
    <br />
    <p>
      Notwithstanding the above, you do own the lyrics or other original musical components of the New Song that
      were written or composed solely by you.
    </p>
    <br />
    <br />
    <p>
      1. With respect to the publishing rights and ownership of the underlying composition embodied in the New Song,
      the Licensee and the Producer hereby acknowledge and agree that the underlying composition shall be owned/split
      between them as follows:
    </p>
    <p>
      You shall own and control Fifty Percent (50%) of the so-called “Writer's Share” of the underlying composition.
      <br />
      Producer shall own and control Fifty Percent (50%) of the so-called “Writer's Share” of the underlying composition.
    </p>
    <br />
    <br />
    <p>
      Producer shall own, control, and administer One Hundred Percent (100%) of the so- called “Publisher's Share”
      of the underlying composition.
    </p>
    <br />
    <br />
    <p>
      In the event that Licensee wishes register his/her interests and rights to the underlying composition
      of the New Song with their Performing Rights Organization (“PRO”), Licensee must simultaneously identify and
      register the Producer's share and ownership interest in the composition to indicate that Producer wrote and
      owns 50% of the composition in the New Song and as the owner of 100% of the Publisher's share of the New Song.
    </p>
    <br />
    <br />
    <p>
      1. Licensee shall be deemed to have signed, affirmed and ratified its acceptance of the terms of this Agreement
      by virtue of its payment of the License Fee to Licensor and its electronic acceptance of its terms and
      conditions at the time Licensee made payment of the License Fee.
    </p>
    <br />
    <br />
    <p>
      1. <strong>Mechanical License:</strong> If any selection or musical composition, or any portion thereof, recorded
      in the New Song hereunder is written or composed by Producer, in whole or in part, alone or in collaboration
      with others, or is owned or controlled, in whole or in part, directly or indirectly, by Producer or any person,
      firm, or corporation in which Producer has a direct or indirect interest, then such selection and/or musical
      composition shall be hereinafter referred to as a “Controlled Composition”. Producer hereby agrees to issue or cause
      to be issued, as applicable, to Licensee, mechanical licenses in respect of each Controlled Composition, which are
      embodied on the New Song. For that license, on United States and Canada sales, Licensee will pay mechanical
      royalties at one hundred percent (100%) of the minimum statutory rate, subject to no cap of that rate for
      albums and/or EPs. For license outside the United States and Canada, the mechanical royalty rate will be the
      rate prevailing on an industry-wide basis in the country concerned on the date that this agreement has been entered into.
    </p>
    <ol>
      <li>
        <strong>Credit:</strong> Licensee shall have the right to use and permit others to use Producer's approved name, approved likeness,
        and other approved identification and approved biographical material concerning the Producer solely for
        purposes of trade and otherwise without restriction solely in connection with the New Song recorded hereunder.
        Licensee shall use best efforts to have Producer credited as a “producer” and shall give Producer appropriate
        production and songwriting credit on all compact discs, record, music video, and digital labels or any other
        record configuration manufactured which is now known or created in the future that embodies the New Song created
        hereunder and on all cover liner notes, any records containing the New Song and on the front and/or back cover
        of any album listing the New Song and other musician credits. Licensee shall use its best efforts to ensure
        that Producer is properly credited and Licensee shall check all proofs for accuracy of credits, and shall use
        its best efforts to cure any mistakes regarding Producer's credit. In the event of any failure by Licensee to
        issue credit to Producer, Licensee must use reasonable efforts to correct any such failure immediately and on a
        prospective basis. Such credit shall be in substantial form: “Produced by <strong>Producer Name</strong>;”.
      </li>
      <li>
        <strong>Audio samples.</strong> 3rd party sample clearance is the responsibility of the licensee.
      </li>
    </ol>
    <br />
    <br />
    <p>
      1. <strong>Licensor's Option:</strong> Licensor shall have the option, at Licensor's sole discretion, to
      terminate this License at any time within three (3) years of the date of this Agreement upon written notice to
      Licensee. In the event that Licensor exercises this option, Licensor shall pay to Licensee a sum equal to
    </p>
    <br />
    <br />
    <p>
      Two Hundred Percent (200%) of the License Fee paid by Licensee. Upon Licensor's exercise of the option,
      Licensee must immediately remove the New Song from any and all digital and physical distribution channels and must
      immediately cease access to any streams and/or downloads of the New Song by the general public.
    </p>
    <br />
    <br />
    <p>
      1. <strong>Breach by Licensee:</strong>
    </p>
    <ol>
      <li>
        Licensee shall have five (5) business days from its receipt of written notice by Producer and/or Producer's
        authorized representative to cure any alleged breach of this Agreement by Licensee. Licensee's failure to
        cure the alleged breach within five (5) business days shall result in Licensee's default of its obligations,
        its breach of this Agreement, and at Producer's sole discretion, the termination of Licensee's rights hereunder.
      </li>
      <li>
        If Licensee engages in the commercial exploitation and/or sale of the Beat or New Song outside of the
        manner and amount expressly provided for in this Agreement, Licensee shall be liable to Producer for
        monetary damages in an amount equal to any and all monies paid, collected by, or received by Licensee,
        or any third party on its behalf, in connection with such unauthorized commercial exploitation of the Beat
        and/or New Song.
      </li>
      <li>
        Licensee recognizes and agrees that a breach or threatened breach of this Agreement by Licensee give rise to
        irreparable injury to Producer, which may not be adequately compensated by damages. Accordingly, in the event
        of a breach or threatened breach by the Licensee of the provisions of this Agreement, Producer may seek and
        shall be entitled to a temporary restraining order and preliminary injunction restraining the Licensee from
        violating the provisions of this Agreement. Nothing herein shall prohibit Producer from pursuing any other
        available legal or equitable remedy from such breach or threatened breach, including but not limited to the
        recovery of damages from the Licensee. The Licensee shall be responsible for all costs, expenses or damages
        that Producer incurs as a result of any violation by the Licensee of any provision of this Agreement.
        Licensee' obligation shall include court costs, litigation expenses, and reasonable attorneys' fees.
      </li>
    </ol>
    <br />
    <br />
    <p>
      1. <strong>Warranties, Representations and Indemnification:</strong>
    </p>
    <ol>
      <li>
        Licensee hereby agrees that Licensor has not made any guarantees or promises that the Beat fits the particular
        creative use or musical purpose intended or desired by the Licensee. The Beat, its sound recording, and the
        underlying musical composition embodied therein, are licensed to the Licensee “as is” without warranties of any
        kind or fitness for a particular purpose.
      </li>
      <li>
        Producer warrants and represents that he has the full right and ability to enter into this agreement,
        and is not under any disability, restriction, or prohibition with respect to the grant of rights hereunder.
        Producer warrants that the manufacture, sale, distribution, or other exploitation of the New Song hereunder
        will not infringe upon or violate any common law or statutory right of any person, firm, or corporation;
        including, without limitation, contractual rights, copyrights, and right(s) of privacy and publicity and will
        not constitute libel and/or slander. Licensee warrants that the manufacture, sale, distribution, or other
        exploitation of the New Song hereunder will not infringe upon or violate any common law or statutory right of
        any person, firm, or corporation; including, without limitation, contractual rights, copyrights, and right(s)
        of privacy and publicity and will not constitute libel and/or slander. The foregoing notwithstanding, Producer
        undertakes no responsibility whatsoever as to any elements added to the New Song by Licensee, and Licensee
        indemnifies and holds Producer harmless for any such elements. Producer warrants that he did not “sample”
        (as that term is commonly understood in the recording industry) any copyrighted material or sound
        recordings belonging to any other person, firm, or corporation (hereinafter referred to as “Owner”) without
        first having notified Licensee. Licensee shall have no obligation to approve the use of any sample thereof;
        however, if approved, any payment in connection therewith, including any associated legal clearance costs,
        shall be borne by Licensee. Knowledge by Licensee that “samples” were used by Producer which were not
        affirmatively disclosed by Producer to Licensee shall shift, in whole or in part, the liability for infringement
        or violation of the rights of any third party arising from the use of any such “sample” from Producer to Licensee.
      </li>
      <li>
        Parties hereto shall indemnify and hold each other harmless from any and all third party claims,
        liabilities, costs, losses, damages or expenses as are actually incurred by the non-defaulting party and
        shall hold the non-defaulting party, free, safe, and harmless against and from any and all claims,
        suits, demands, costs, liabilities, loss, damages, judgments, recoveries, costs, and expenses;
        (including, without limitation, reasonable attorneys' fees), which may be made or brought, paid, or incurred
        by reason of any breach or claim of breach of the warranties and representations hereunder by the
        defaulting party, their agents, heirs, successors, assigns and employees, which have been reduced to final
        judgment; provided that prior to final judgment, arising out of any breach of any representations or
        warranties of the defaulting party contained in this agreement or any failure by defaulting party to
        perform any obligations on its part to be performed hereunder the non-defaulting party has given the
        defaulting party prompt written notice of all claims and the right to participate in the defense with
        counsel of its choice at its sole expense. In no event shall Artist be entitled to seek injunctive or any
        other equitable relief for any breach or non-compliance with any provision of this agreement.
      </li>
    </ol>
    <br />
    <br />
    <p>
      <strong>Audio Samples.</strong> 3rd party sample clearance is the responsibility of the licensee.
    </p>
    <br />
    <br />
    <p>
      1. <strong>Miscellaneous:</strong> This Agreement constitutes the entire understanding of the parties and is intended
      as a final expression of their agreement and cannot be altered, modified, amended or waived, in whole or in part,
      except by written instrument (email being sufficient) signed by both parties hereto. This agreement supersedes
      all prior agreements between the parties, whether oral or written. Should any provision of this agreement be held
      to be void, invalid or inoperative, such decision shall not affect any other provision hereof, and the remainder of
      this agreement shall be effective as though such void, invalid or inoperative provision had not been contained herein.
      No failure by Licensor hereto to perform any of its obligations hereunder shall be deemed a material breach of this
      agreement until the Licensee gives Licensor written notice of its failure to perform, and such failure has not been
      corrected within thirty (30) days from and after the service of such notice, or, if such breach is not reasonably
      capable of being cured within such thirty (30) day period, Licensor does not commence to cure such breach within said
      time period, and proceed with reasonable diligence to complete the curing of such breach thereafter.
      This agreement shall be governed by and interpreted in accordance with the laws of the <strong>Producer Country</strong>
      applicable to agreements entered into and wholly performed in said State, without regard to any conflict of laws
      principles. You hereby agree that the exclusive jurisdiction and venue for any action, suit or proceeding based upon
      any matter, claim or controversy arising hereunder or relating hereto shall be in the state or federal courts
      located in the <strong>Producer Country</strong>. You shall not be entitled to any monies in connection with the Master(s) other
      than as specifically set forth herein. All notices pursuant to this agreement shall be in writing and shall be
      given by registered or certified mail, return receipt requested (prepaid) at the respective addresses hereinabove
      set forth or such other address or addresses as may designated by either party. Such notices shall be deemed
      given when received. A copy of all such notices sent to the Producer shall be concurrently sent to
      [ [lawfirm_name_address]]. Any notice mailed will be deemed to have been received five (5) business days after
      it is mailed; any notice dispatched by expedited delivery service will be deemed to be received two
      (2) business days after it is dispatched. YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE READ THIS AGREEMENT AND HAVE
      BEEN ADVISED BY US OF THE SIGNIFICANT IMPORTANCE OF RETAINING AN INDEPENDENT ATTORNEY OF YOUR CHOICE TO
      REVIEW THIS AGREEMENT ON YOUR BEHALF. YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE HAD THE UNRESTRICTED
      OPPORTUNITY TO BE REPRESENTED BY AN INDEPENDENT ATTORNEY. IN THE EVENT OF YOUR FAILURE TO OBTAIN AN
      INDEPENDENT ATTORNEY OR WAIVER THEREOF, YOU HEREBY WARRANT AND REPRESENT THAT YOU WILL NOT ATTEMPT TO USE
      SUCH FAILURE AND/OR WAIVER as a basis to avoid any obligations under this agreement, or to invalidate this
      agreement or To render this agreement or any part thereof unenforceable. This agreement may be executed in
      counterparts, each of which shall be deemed an original, and said counterparts shall constitute one and the
      same instrument. In addition, a signed copy of this agreement transmitted by facsimile or scanned into an
      image file and transmitted via email shall, for all purposes, be treated as if it were delivered containing an
      original manual signature of the party whose signature appears thereon and shall be binding upon such party as
      though an originally signed document had been delivered. Notwithstanding the foregoing, in the event that you do
      not sign this Agreement, your acknowledgement that you have reviewed the terms and conditions of this Agreement
      and your payment of the License Fee shall serve as your signature and acceptance of the terms and conditions
      of this Agreement.
    </p>
  </div>
</template>

<script>
import moment from 'moment'

const numWords = require('num-words')
export default {
  props: {
    beat: Object,
    pricing: Object
  },
  data: function () {
    return {
      music_video_number: numWords(this.pricing.music_videos)
    }
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
