<template>
<div class="testimonial-wrap" v-if="info">
    <div class="testimonial">
        <p>
            {{ info.descripcion }}
        </p>
    </div>
    <cite class="testimonial-author d-flex align-items-center">
        <span class="name">
            <strong>{{ setName }}</strong>
        </span>
        <span class="stars">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
        </span>
    </cite>
</div>
</template>

<script>
export default {
	props: ['info'],
	computed: {
		setName: function() {
			let fullName = '',
				name = this.info.User.name,
				lastname = this.info.User.surnames

			if(name && lastname) {
				fullName = `${name} ${lastname}`
			} else {
				fullName = name
			}

			return fullName
		}
	}
}
</script>

<style lang="scss">
.testimonial-wrap {
	margin: 10px auto;
}
.testimonial {
	background: white;
	border-radius: 3px;
	border: 1px solid rgba($dark, .1);
	box-shadow: 0 2px 0 0 rgba(1,1,1,0.10);
	position: relative;
	color: #666;
	padding: 20px;
	margin-bottom: 30px;

	&:before, &:after {
		position: absolute;
	    visibility: visible;
	    width: 0;
	    height: 0;
	    content: "";
	    border-style: solid;
	    border-color: transparent;
	    border-bottom: 0;
	}
	&:before {
		border-width: 17px;
	    border-top-color: rgba(1,1,1,0.15);
	    bottom: -17px;
	    left: 14px;
	}
	&:after {
		border-width: 15px;
		border-top-color: #fff;
		bottom: -15px;
		left: 16px;
	}
}
.testimonial-author {
	display: block;
	line-height: 1.2;

	.name {
		color: $success;
	}
	strong {
		display: block;
		font-weight: 600;
		font-size: 22px;
		color: $dark;
	}
	.name, .stars {
		display: block;
		float: left;
	}
	.stars {
		display: inline-block;
		margin-left: 20px;
		font-size: 1em;
		line-height: 45px;
		color: #FFBE3E;
	}
}
</style>