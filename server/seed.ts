import { supabase } from './supabaseClient.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/**
 * Seed script: Inserts the original mock data into Supabase.
 * Run with: npx tsx server/seed.ts
 */

async function seed() {
    console.log('🌱 Starting seed...');

    // 1. Create user
    const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
            name: 'Alex',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKwU2QFZMnJs3Qeibv_zjjHMnAhSbwoBBsqHe5FJfngtmlGevDf2_5pUPZDL7x1RmTcdty6hULWm0knZc8rZ9VRsCx7VYJ2GO88p7bEdVPKf9uTw7VlzW0maN1vQDkPZyx8va2K3QpX7wBzdVMuZRa82_3uEdYUR_6D8PaeqUbDhb0k23VZWuoiU7GQ-qqHglUPZzz7LmYYnGMWZ1EI1ENXsER_ts7nQ5BsSYEHqd99ZbikxF9bVz3y4BWKe5UZDO1QxgpXXEKsZOi',
            weekly_message: '嘿 Alex，你这周的表现太棒了！继续加油哦！',
        })
        .select()
        .single();

    if (userError) {
        console.error('❌ Failed to create user:', userError);
        return;
    }

    console.log(`✅ Created user: ${user.name} (${user.id})`);

    // 2. Create sports
    const sportsData = [
        {
            name: '颠球',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCylQ48xmmubZ4L5U20Fb60xbVOhrXGey01DSZD6KYtEEyxxGm_R6nAj5BEgVo173V9ShZoj94EA94LTTXga9bE5TOjYlQGLRMNqSmhL8loewb6Sm5kLq4NKp6lF1eBGcxYQ_UNQticczD056cO0AYlTThkzL96PeWig3VrW4jnSubXo8uC3C6e_eHUvS7o5HC6qdZHfkjyO4aiYnTYLVUlwAazrlBvmBQy3uYNVtauzpvxUug1nHdOY8FwY2lmcnq4uXoZ0sEwH8TL',
        },
        {
            name: '最快一公里',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJFVAJ9vU75s7FDIzWqDDCTt9P3GpZ3tJ-j2aCOMtuDLyOF35YUuFH-5GkzLTe1agtPn_4ERD5ZlCVCJc--IqV068Yfy6FRHFdwWOZK-FYkpBGY6jHne9L4dXtESN5H4a88B4boLI8l6LLJVjUcesEOoiTz0G2sYp7yeDCfxAbHSotIz4SqupZ-R3sCoeEc0NY80gwtfVGk64Erbl0DlopIUlkXmY0xhJ-RSO0GF19CbC4sMrjdXPtRBHAVoSuZpHLMat8OCVfy65S',
        },
        {
            name: '罚球',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0os44ujhWvKfKZ7Fa0IGM8jGfwVDOutcF_NSYpkElDWdIA0TsFQNkfBFEfA8o2yJLKGwGPE0jBsIXWDUr4pCl_SxMhPA-SkysWym9CSDgQnk9DUW-7pBkiL1Qxm6xI_3IzmoFUdcrh-BwosIYg7n29YLhTen0JYb9GPKEyCDfDJjOLDu38s734iCGSaP-762n5IYj-3yVnWCyXJY7dsFZOcofx-HgfKftxO9jxNAw-3mZ0pda3yv5A9xso64faQywNEhTiSN7U5-A',
        },
    ];

    const { data: sports, error: sportsError } = await supabase
        .from('sports')
        .insert(sportsData.map(s => ({ ...s, user_id: user.id })))
        .select();

    if (sportsError) {
        console.error('❌ Failed to create sports:', sportsError);
        return;
    }

    console.log(`✅ Created ${sports.length} sports`);

    // 3. Create records for 颠球
    const jugglingId = sports.find((s: any) => s.name === '颠球')?.id;
    if (jugglingId) {
        const jugglingRecords = [
            { value: 52, unit: '个', date: '10月12日 16:30', timestamp: 1697103000000, tags: ['broken_record'], images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCylQ48xmmubZ4L5U20Fb60xbVOhrXGey01DSZD6KYtEEyxxGm_R6nAj5BEgVo173V9ShZoj94EA94LTTXga9bE5TOjYlQGLRMNqSmhL8loewb6Sm5kLq4NKp6lF1eBGcxYQ_UNQticczD056cO0AYlTThkzL96PeWig3VrW4jnSubXo8uC3C6e_eHUvS7o5HC6qdZHfkjyO4aiYnTYLVUlwAazrlBvmBQy3uYNVtauzpvxUug1nHdOY8FwY2lmcnq4uXoZ0sEwH8TL'] },
            { value: 45, unit: '个', date: '10月11日 17:15', timestamp: 1697019300000, tags: ['improved'], images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBKwU2QFZMnJs3Qeibv_zjjHMnAhSbwoBBsqHe5FJfngtmlGevDf2_5pUPZDL7x1RmTcdty6hULWm0knZc8rZ9VRsCx7VYJ2GO88p7bEdVPKf9uTw7VlzW0maN1vQDkPZyx8va2K3QpX7wBzdVMuZRa82_3uEdYUR_6D8PaeqUbDhb0k23VZWuoiU7GQ-qqHglUPZzz7LmYYnGMWZ1EI1ENXsER_ts7nQ5BsSYEHqd99ZbikxF9bVz3y4BWKe5UZDO1QxgpXXEKsZOi'] },
            { value: 42, unit: '个', date: '10月09日 16:45', timestamp: 1696844700000, tags: ['stable'], images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAJFVAJ9vU75s7FDIzWqDDCTt9P3GpZ3tJ-j2aCOMtuDLyOF35YUuFH-5GkzLTe1agtPn_4ERD5ZlCVCJc--IqV068Yfy6FRHFdwWOZK-FYkpBGY6jHne9L4dXtESN5H4a88B4boLI8l6LLJVjUcesEOoiTz0G2sYp7yeDCfxAbHSotIz4SqupZ-R3sCoeEc0NY80gwtfVGk64Erbl0DlopIUlkXmY0xhJ-RSO0GF19CbC4sMrjdXPtRBHAVoSuZpHLMat8OCVfy65S'] },
            { value: 38, unit: '个', date: '10月08日 17:00', timestamp: 1696759200000, tags: ['keep_going'], images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB0os44ujhWvKfKZ7Fa0IGM8jGfwVDOutcF_NSYpkElDWdIA0TsFQNkfBFEfA8o2yJLKGwGPE0jBsIXWDUr4pCl_SxMhPA-SkysWym9CSDgQnk9DUW-7pBkiL1Qxm6xI_3IzmoFUdcrh-BwosIYg7n29YLhTen0JYb9GPKEyCDfDJjOLDu38s734iCGSaP-762n5IYj-3yVnWCyXJY7dsFZOcofx-HgfKftxO9jxNAw-3mZ0pda3yv5A9xso64faQywNEhTiSN7U5-A'] },
            { value: 35, unit: '个', date: '10月05日 16:20', timestamp: 1696497600000, tags: ['completed'], images: [] },
        ];

        const { error: recError } = await supabase
            .from('records')
            .insert(jugglingRecords.map(r => ({ ...r, sport_id: jugglingId, user_id: user.id })));

        if (recError) {
            console.error('❌ Failed to create records:', recError);
            return;
        }
        console.log(`✅ Created ${jugglingRecords.length} juggling records`);
    }

    console.log('');
    console.log('🎉 Seed complete!');
    console.log(`📋 User ID: ${user.id}`);
    console.log(`💡 Add this to your .env.local: DEFAULT_USER_ID=${user.id}`);
}

seed().catch(console.error);
