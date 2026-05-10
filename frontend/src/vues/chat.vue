<script setup></script>

<template>
    <header>
        <img src="../images/logo-full.svg" alt="gardinspiration logo" id="logo">
        <img src="../images/user-icon.svg" alt="user icon" id="user">
    </header>

    <div id="chatField">
        <div id="texts">
            <p class="prompt">Prompt</p>

            <p class="bot">Answer</p>

            <!-- Not sure if AI is going to give a redirect button, but here is a button with styling -->
            <button>Manage Garden</button>
        </div>


        <form>
            <input type="text" name="prompt" id="prompt">
            <input type="submit" value="send" id="submit">
        </form>
    </div>

</template>

<style scoped>
    form {
        position: absolute;
        width: 90%;
        bottom: 30px;
        height: 75px;
        left: 50%;
        transform: translateX(-50%);
    }

    #submit {
        position: absolute;
        right: 20px;
        bottom: 10px;
        font-size: 24px;
        padding: 5px;
        width: 150px;
        height: 45px;
        margin: 0;
        box-sizing: border-box;
    }

    #chatField {
        position: relative;
        max-width: 1000px;
        margin: auto;
        /* background-color: aliceblue; */
        height: calc(100vh - 120px);
    }

    #chatField p {
        max-width: 60%;
        font-size: 22px;
    }

    #texts {
        display: flex;
        flex-direction: column;
        overflow-y:auto ;
        height: calc(100% - 150px);
    }

    .prompt {
        text-align: right;
        margin-left: auto;
        padding: 10px;
        background-color: #FFFAC7;
        color: #403520;
        border-radius: 20px;
    }

    .bot {
        margin-right: auto;
        font-size: 18px;
    }

    #prompt {
        margin: 0;
        margin-right: 20%;
        text-align: left;
        height: 100%;
        width: 80%;
        background: none;
        border:none;
    }

    button {
        background-color: #FFFAC7;
        color: #403520;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 20px;
        padding: 15px;
        margin-left: auto;
    }
</style>