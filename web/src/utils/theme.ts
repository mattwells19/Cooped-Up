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
  styles: {
    global: {
      body: {
        height: "100%",
        minHeight: "100vh",
        scrollBehavior: "smooth",
      },
    },
  },
});
