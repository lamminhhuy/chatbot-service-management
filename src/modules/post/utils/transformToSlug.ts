export const transformToSlug = ( title: string, fullSlugCategory?: string): { spacedString?: string, slug: string } => {
    const removeVietnameseTones = (str: string): string => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };

   
    const spacedString = fullSlugCategory
        ?.split('/')
        .map(segment => removeVietnameseTones(segment)
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')           
            .trim())                        
        .join('/');

    const categorySlug = fullSlugCategory
        ?.split('/')
        .map(segment => removeVietnameseTones(segment)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')     
            .replace(/-{2,}/g, '-')         
            .replace(/^-+|-+$/g, ''))       
        .join('/');

    const titleSlug = removeVietnameseTones(title)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')         
        .replace(/-{2,}/g, '-')             
        .replace(/^-+|-+$/g, '');           

    const slug = fullSlugCategory ? `${categorySlug}/${titleSlug}` : titleSlug;

    return { spacedString, slug };
};