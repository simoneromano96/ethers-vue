import Metamask from '../components/metamask/Metamask.vue';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Metamask/Metamask',
  component: Metamask,
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Metamask },
  // Then, those values can be accessed directly in the template
  template: '<metamask />',
});

export const MetamaskDemo = Template.bind({});
