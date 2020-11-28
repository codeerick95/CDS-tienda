import { appConfig } from "@/env";

export const logout = {
    methods: {
        logout() {
            this.loading = true;

            this.$apolloHelpers.onLogout().then(() => {
                setTimeout(() => {
                    this.$cookies.remove(appConfig.userData);

                    this.$store.commit("setUsuarioLogueado", false);

                    this.loading = false;

                    this.$router.push("/");

                    this.$bvModal.show("modal-auth");
                }, 1500);
            });
        }
    }
}