// components/switch/switch.js
Component({
    /**
     * Component properties
     */
    properties: {
        value: {
            type: Boolean,
            value: false
        },
        type: {
            type: String,
            value: ''
        }
    },

    /**
     * Component initial data
     */
    data: {
        value: true,
    },

    /**
     * Component methods
     */
    methods: {
        toggle() {
            const data = this.data;
            const value = data.value ? false : true;
            this.triggerEvent('change', {
                value: value,
                type: data.type
            })
        }
    }
})
