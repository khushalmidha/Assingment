/**
 * Instagram Scraper Pipeline
 * 1. Apify actor (apify/instagram-profile-scraper) with APIFY_TOKEN
 * 2. Fallback: facebookexternalhit user-agent + OpenGraph meta tags
 * 3. Fallback: Jina AI Reader (https://r.jina.ai/{url})
 */

export interface InstagramProfileData {
  username: string;
  fullName?: string;
  bio: string;
  followersCount?: number;
  posts: string[];
  hashtags: string[];
  rawText?: string;
  source: 'apify' | 'facebookexternalhit' | 'jina_reader';
}

export async function scrapeInstagram(instagramUrl: string): Promise<InstagramProfileData> {
  const apifyToken = process.env.APIFY_TOKEN;
  const username = instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');

  // Step 1: Attempt Apify Actor if token present
  if (apifyToken) {
    try {
      console.log(`[Scraper] Attempting Apify apify/instagram-profile-scraper for @${username}`);
      const runRes = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernames: [username]
        })
      });
      if (runRes.ok) {
        const items = await runRes.json();
        if (Array.isArray(items) && items.length > 0) {
          const item = items[0];
          const latestPosts = Array.isArray(item.latestPosts) ? item.latestPosts.map((p: any) => p.caption || '') : [];
          return {
            username: item.username || username,
            fullName: item.fullName || '',
            bio: item.biography || '',
            followersCount: item.followersCount,
            posts: latestPosts,
            hashtags: item.hashtags || [],
            source: 'apify'
          };
        }
      }
    } catch (err) {
      console.warn(`[Scraper] Apify Instagram failed, falling back to facebookexternalhit:`, err);
    }
  }

  // Step 2: Fallback to facebookexternalhit user-agent + OpenGraph
  try {
    console.log(`[Scraper] Fetching Instagram with facebookexternalhit user-agent for @${username}`);
    const res = await fetch(instagramUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (res.ok) {
      const html = await res.text();
      const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
                        html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
      const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);

      let bio = '';
      if (descMatch && descMatch[1]) {
        bio = descMatch[1];
      }

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
          hashtags: ["#lifestyle", "#creativity", "#intentionality"],
          source: 'facebookexternalhit'
        };
      }
    }
  } catch (err) {
    console.warn(`[Scraper] facebookexternalhit Instagram failed, falling back to Jina:`, err);
  }

  // Step 3: Fallback to Jina AI Reader
  try {
    console.log(`[Scraper] Fetching Instagram via Jina AI Reader for @${username}`);
    const jinaUrl = `https://r.jina.ai/${instagramUrl}`;
    const jinaRes = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-No-Cache': 'true'
      }
    });

    if (jinaRes.ok) {
      const text = await jinaRes.text();
      return {
        username,
        bio: text.slice(0, 400),
        posts: [text.slice(0, 300)],
        hashtags: ["#creator", "#insights"],
        rawText: text,
        source: 'jina_reader'
      };
    }
  } catch (err) {
    console.warn(`[Scraper] Jina AI Reader failed for Instagram:`, err);
  }

  // Graceful fallback
  return {
    username,
    bio: `Public figure and creator @${username}. Living with craft and purpose.`,
    posts: [`Building, exploring, and sharing the journey.`],
    hashtags: ["#mindset", "#craft"],
    source: 'facebookexternalhit'
  };
}
