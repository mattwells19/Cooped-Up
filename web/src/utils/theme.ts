import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "teal",
      },
    },
  },
});
