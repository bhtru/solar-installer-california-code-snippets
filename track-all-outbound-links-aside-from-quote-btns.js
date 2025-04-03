<script>
document.addEventListener('click', function(e) {
    const link = e.target.closest('a:not(.pill-link.pill-link--blue)');
    if (link && link.hostname !== window.location.hostname) {
        const url = new URL(link.href);

        // UTM values for global outbound links
        url.searchParams.set('utm_source', 'sica-solar-installer-california');
        url.searchParams.set('utm_medium', 'referral');
        url.searchParams.set('utm_campaign', 'outbound-links');

        // Dynamically use the element's class for `utm_content`
        const elementClass = link.className.replace(/\s+/g, '-').toLowerCase() || 'unknown-element';
        url.searchParams.set('utm_content', elementClass);

        link.href = url.toString();
    }
});
</script>