export const useLogout = async () => {
    await fetch('/logout');
    window.location.reload();
}