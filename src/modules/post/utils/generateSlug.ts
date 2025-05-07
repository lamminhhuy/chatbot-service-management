export const generateSlug = (title: string): string => {
    const removeVietnameseTones = (str: string): string => {
        return str
            .normalize('NFD') 
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd') 
            .replace(/Đ/g, 'D'); 
    };

    return removeVietnameseTones(title)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-{2,}/g, '-')   
        .replace(/^-+|-+$/g, '');   
};