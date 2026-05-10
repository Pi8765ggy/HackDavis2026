<script setup></script>
<template>
    <header>
        <img src="../images/logo-full.svg" alt="gardinspiration logo" id="logo">
        <img src="../images/user-icon.svg" alt="user icon" id="user">
    </header>

    <div id="container">
        <section id="menu">
            <h1>Your Garden</h1>


            <!-- toggle class='hidden' between 'btn' and 'addPlant' -->
            <div id="btn">
                <button>Add plant</button>
                <button>Edit garden</button>
                <button>Ask our chatbot</button>
            </div>
            
            <div id="addPlant"  class="hidden">
                <h2>Add a new plant</h2>
                <!-- Put form field here -->
                <button>Add</button>
            </div>
        </section>

        <section id="list">
            <div class="plant">
                <img src="../images/flower1.jpg" alt="flower 1">
                <p>Plant 1</p>
            </div>

            <div class="plant">
                <img src="../images/tree1.jpg" alt="tree 1">
                <p>Plant 2</p>
            </div>

            <div class="plant">
                <img src="../images/bush1.jpg" alt="bush 1">
                <p>Plant 3</p>
            </div>

            <div class="plant">
                <img src="../images/tree2.jpg" alt="tree 2">
                <p>Plant 4</p>
            </div>

            <div class="plant">
                <img src="../images/bush3.jpg" alt="bush 3">
                <p>Plant 5</p>
            </div>

            <div class="plant">
                <img src="../images/tree3.jpg" alt="tree 3">
                <p>Plant 6</p>
            </div>

            <div class="plant">
                <img src="../images/bush4.jpg" alt="bush 4">
                <p>Plant 7</p>
            </div>

            <div class="plant">
                <img src="../images/tree4.jpg" alt="tree 4">
                <p>Plant 8</p>
            </div>
        </section>
    </div>
</template>

<style scoped>
    .hidden {
        display: none;
    }

    #container {
        display: flex;
        gap: 30px;
        box-sizing: border-box;
        padding: 20px 40px;
        align-items: stretch;

    }

    #menu {
        flex: 1;
        background-color: #8BBF56;
        text-align: center;
        color: #403520;
        font-size: 24px;
    }

    #menu button {
        display: block;
        background-color: #FFFAC7;
        color: #403520;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 20px;
        padding: 15px;
        margin: 20px auto;
    }

    #btn {
        margin-top: 30px;
    }

    #addPlant {
        background-color: #FFFAC7;
        border-radius: 20px;
        margin: 10px;
        color: #403520;
        padding: 5px;
    }

    #addPlant h2 {
        color: #403520;
        font-size: 24px;
    }

    #addPlant button {
        background-color: #8BBF56;

    }

    

    #list {
        flex: 3;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .plant {
        position: relative;
    }

    #list img {
        width: 100%;
        height: auto;
    }
</style>
