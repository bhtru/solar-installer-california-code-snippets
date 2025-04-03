<script>
    if (document.querySelector('a.pill-link.pill-link--blue')) {
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a.pill-link.pill-link--blue');
            if (link && link.hostname !== window.location.hostname) {
                const url = new URL(link.href);

                url.searchParams.set('utm_source', 'sica-solar-installer-california');
                url.searchParams.set('utm_medium', 'referral');
                url.searchParams.set('utm_campaign', 'installer-profile');

                const installerId = link.getAttribute('data-installer-id') || 'unknown';
                url.searchParams.set('utm_id', installerId);

                url.searchParams.set('utm_content', 'get-quote-btn');

                link.href = url.toString();
            }
        });
    }
</script>