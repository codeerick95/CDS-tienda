<template>
<article class="card border-0 protocolo">
 <div class="card-body">
    <nuxt-link :to="{name: 'protocolos-slug', params: {slug: info.slug}}" class="protocolo__title font-weight-bold">
        {{ info.titulo }}
    </nuxt-link>

    <section class="d-flex justify-content-between align-items-center" v-if="$route.name != 'protocolos-slug'">
        <p class="mt-0 small">
            Por
            <span class="text-danger">Admin</span>
        </p>

        <p class="mt-0 small text-muted">
            <i class="far fa-calendar-alt"></i>
            {{ $moment(info.created_at).format('DD-MM-YYYY') }}
        </p>
    </section>

    <nuxt-link :to="{name: 'protocolos-slug', params: {slug: info.slug}}">
        <img :src="info.imagen.url" :alt="info.titulo" class="protocolo__image">
    </nuxt-link>
 </div>
</article>
</template>

<script>
export default {
    props: ['info']
}
</script>

<style lang="scss" scoped>
.protocolo {
    &__title {
        color: rgba($dark, .9);
        font-size: 1.5em;
    }

    &__image {
        max-width: 100%;
        width: 100%;

        @media (min-width: 768px) {
            max-height: 20vw;
        }

        border-radius: .3rem;
        
        transition: transform .5s;

        &:hover {
            transform: scale(1.01);
        }
    }
}
</style>