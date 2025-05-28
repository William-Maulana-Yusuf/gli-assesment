<template>
    <p>Home</p>
    <table>
        <tr>
            <td>First Name</td>
            <td>Last Name</td>
        </tr>
        <tr v-for="user in users" :key="user.id">
            <td>{{  user.firstName }}</td>
            <td>{{  user.lastName }}</td>
        </tr>
    </table>
</template>

<script>
import axios from 'axios';
export default {
    name: "Home",
    async mounted() {
        const res = await axios.get('https://dummyjson.com/users')
        const users = res.data.users
        // console.log(res.data.users);
    },
}
</script>