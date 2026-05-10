<script>
    import {ref} from 'vue'

    const showResult =  ref(false)

    function switchView() {
        showResult.value = false
    }

    function onSubmit() {
        showResult.value = true
    }
</script>

<template>
    <header>
        <img src="../images/logo-full.svg" alt="gardinspiration logo" id="logo">
        <img src="../images/user-icon.svg" alt="user icon" id="user">
    </header>

    <!-- toggle the class "invis" switch display -->
    <!-- <div id="intialPage" class="invis"> -->
    <div id="intialPage">
        <h1>Find the perfect plants for your garden</h1>
        
        <form @submit.prevent="onSubmit">
            <h2>Enter your ZIP Code</h2>

            <input type="text" id="zip" name="zip">

            <input type="submit" value="START" id="submit">
        </form>

        <div id="img-container">
                <div class="gallery" id="row1">
                <img src="../images/tree1.jpg" alt="tree 1">
                <img src="../images/tree2.jpg" alt="tree 2">
                <img src="../images/flower1.jpg" alt="flower 1">
                <img src="../images/bush1.jpg" alt="bush 1">
                <img src="../images/bush6.jpg" alt="bush 2">
                <img src="../images/tree1.jpg" alt="tree 1">
                <img src="../images/tree2.jpg" alt="tree 2">
                <img src="../images/flower1.jpg" alt="flower 1">
                <img src="../images/bush1.jpg" alt="bush 1">
                <img src="../images/bush6.jpg" alt="bush 2">
                <img src="../images/tree1.jpg" alt="tree 1">
                <img src="../images/tree2.jpg" alt="tree 2">
                <img src="../images/flower1.jpg" alt="flower 1">
                <img src="../images/bush1.jpg" alt="bush 1">
                <img src="../images/bush6.jpg" alt="bush 2">
            </div>

            <div class="gallery" id="row2">
                <img src="../images/tree3.jpg" alt="tree 3">
                <img src="../images/tree4.jpg" alt="tree 4">
                <img src="../images/bush3.jpg" alt="bush 3">
                <img src="../images/tree5.jpg" alt="tree 5">
                <img src="../images/bush4.jpg" alt="bush 4">
                <img src="../images/tree3.jpg" alt="tree 3">
                <img src="../images/tree4.jpg" alt="tree 4">
                <img src="../images/bush3.jpg" alt="bush 3">
                <img src="../images/tree5.jpg" alt="tree 5">
                <img src="../images/bush4.jpg" alt="bush 4">
                <img src="../images/tree3.jpg" alt="tree 3">
                <img src="../images/tree4.jpg" alt="tree 4">
                <img src="../images/bush3.jpg" alt="bush 3">
                <img src="../images/tree5.jpg" alt="tree 5">
                <img src="../images/bush4.jpg" alt="bush 4">
            </div>

        </div>
    </div>

    <!-- toggle class "hidden" to switch display-->
    <div id="resultView" class="hidden"> 
        <section id="zone">
            <p>Your Zone is:</p>
            <h2>Davis Zone</h2>

            <button id="reset">Enter another location</button>

            <!-- if logged in, remove the words "Log-in to" -->
            <button id="garden">Log-in to manage your garden</button>
        </section>

        <section id="showPlants">
            <h3>Here are some plants we recommend for your location</h3>
            <article>
                <img src="../images/flower1.jpg" alt="flower">
                <div>
                    <h2>Flower 1</h2>
                    <p>Despcription for the plant goes here</p>
                </div>   
            </article>

            <article>
                <img src="../images/tree1.jpg" alt="tree">
                <div>
                    <h2>tree 1</h2>
                    <p>Despcription for the plant goes here</p>
                </div>   
            </article>
        </section>
        <!-- <button id="reset" @click="switchView">Click Me</button> -->
    </div>
</template>

<style>
    /* shared */
    h1 {
        font-weight: 500;
        text-align: center;
    }

    h2 {
        color: #FFFAC7;
    }

    .invis {
        display: none;
    }

    /* zone display page */
    #resultView {
        box-sizing: border-box;
        position: absolute;
        z-index: -1;
        top: 120px;
        transform: translateY(0);
        transition: transform 1s ease-in-out;
        background-color: #58554A;
        width: 100vw;
        padding:0 15px;
        display: flex;
        gap: 20px;
        align-items: stretch;
    }

    #resultView.hidden {
        display: none;
        transform: translateY(-100%);
    }

    #zone {
        flex: 1;
        background-color: #8BBF56;
        text-align: center;
        color: #403520;
        font-size: 24px;
    }

    #zone h2 {
        font-size: 36px;
        color: #403520;
        margin-top: 30px;
    }

    #zone button {
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

    #showPlants {
        flex: 2;
        padding: 0 50px;
        box-sizing: border-box;
    }

    #showPlants h3 {
        font-weight: 400;
    }

    article {
        display: flex;
        gap: 30px;
        border: solid 4px #9FE459;
        border-radius: 20px;
        margin-bottom: 20px;
    }

    article img {
        flex: 1;
        max-width: 30%;
        aspect-ratio: 1;
        box-sizing: border-box;
        padding: 15px;
    }

    /* zip code input page */
    form {
        width: 95%;
        border-radius: 20px;
        text-align: center;
        border: solid 4px #9FE459;
        margin-top: 30px auto 0;
        background-color: #58554A;
    }

    #zip {
        border: solid 3px #f9ffab;
        width: 90%;
        height: 60px;
        background-color: #58554A;
        color: #FFF6E6;
        font-size: 24px;
        text-align: center;
    }

    #submit {
        width: 200px;
        height:72px;
        background-color: #9FE459;
        color: #3b3729;
        margin: 40px 20px;
        cursor: pointer;
        border: none;
        font-weight: 500;
        font-size: 30px;
        border-radius: 12px;
    }

    .gallery img{
        height: calc((100vh - 270px)/2);
        width: auto;
    }

    #img-container {
        overflow: hidden;
    }

    .gallery {
        position: absolute;
        display: flex;
        gap: 20px;
        width: 100%;
        z-index: -1;
    }

    #row1 {
        top: 210px;
        animation: scroll1 20s linear infinite;

    }

    #row2 {
        bottom: 10px;
        animation: scroll2 20s linear infinite;

    }

    @keyframes scroll1 {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
    }

    @keyframes scroll2 {
        0% { transform: translateX(-50%); }
        100% { transform: translateX(0); }
    }

    @media screen and (min-width: 1000px) {
        form {
            width: 50%;
            margin: auto;
        }
    }
</style>
