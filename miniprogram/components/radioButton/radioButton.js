// components/cell/cell.js
Component({
  externalClasses: ['custom-class'],
  options: {
      multipleSlots: true
  },
  /**
   * Component properties
   */
  properties: {
      data: {
          type: Array,
          value: []
      },
      title: {
          type: String,
          value: ''
      }
  },
  

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    btnTap(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('click', { index })
    }
  }
})
