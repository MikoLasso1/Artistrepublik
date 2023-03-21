import validationErrors from '../../shared/components/ValidationErrors'

export default {
  data () {
    return {
      validationErrors: []
    }
  },
  components: {
    validationErrors
  },
  methods: {
    formatErrors (items) {
      const errors = [];

      (items || []).map(value => {
        errors.push(value[0])
      })

      return errors
    }
  }
}
