<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
    <form @submit.prevent="greet">
        <Button type="submit" label="Submit"/>
        <h3>{{message}}</h3>
      </form>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
