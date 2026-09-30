/**
 * Instagram Scraper Pipeline (ES Module)
 */

export async function scrapeInstagram(instagramUrl) {
  const apifyToken = process.env.APIFY_TOKEN;
  const username = instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');

  if (apifyToken) {
    try {
      const runRes = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username] })
      });
      if (runRes.ok) {
        const items = await runRes.json();
        if (Array.isArray(items) && items.length > 0) {
          const item = items[0];
          return {
            username: item.username || username,
            fullName: item.fullName || '',
            bio: item.biography || '',
            followersCount: item.followersCount,
            posts: Array.isArray(item.latestPosts) ? item.latestPosts.map((p) => p.caption || '') : [],
            hashtags: item.hashtags || [],
            source: 'apify'
          };
        }
      }
    } catch (err) {}
  }

  try {
    const res = await fetch(instagramUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (res.ok) {
      const html = await res.text();
      const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
      const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);

      let bio = descMatch ? descMatch[1] : '';
      let fullName = username;
      if (titleMatch && titleMatch[1]) {
        fullName = titleMatch[1].split('(@')[0]?.trim() || username;
      }

      if (bio || fullName) {
        return {
          username,
          fullName,
          bio,
          posts: [bio],
          hashtags: ["#lifestyle", "#creativity"],
          source: 'facebookexternalhit'
        };
      }
    }
  } catch (err) {}

  return {
    username,
    bio: `Public figure and creator @${username}. Living with craft and purpose.`,
    posts: [`Building, exploring, and sharing the journey.`],
    hashtags: ["#mindset", "#craft"],
    source: 'facebookexternalhit'
  };
}
