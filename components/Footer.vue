<template>
  <div class="footer">
    <footer>
      <a class="QTTlogo" href="https://discord.gg/CPQujfCDJw" target="_blank"
        ><img src="../assets/QTTlogo.png" alt="" class="img"
      /></a>
    </footer>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1em;
  padding-top: 35px;
}
.QTTlogo {
  position: static;
}
.img {
  margin: 0 15px 10px 50px;
}
</style>
