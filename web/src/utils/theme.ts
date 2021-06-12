import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
  components: {
    Button: {
      defaultProps: {
        colorScheme: "teal",
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});
