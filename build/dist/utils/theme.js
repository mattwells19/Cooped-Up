import {extendTheme} from "../../_snowpack/pkg/@chakra-ui/react.js";
export default extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "teal"
      }
    }
  }
});
