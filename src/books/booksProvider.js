import axios from "axios";

const booksProvider = {
    getBooksByTitle: async (title) => {
        try {
            let results = [];
            await axios({
                method: 'GET',
                url: `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.ALADIN_TTB}&Version=20131101&Query=${title}&QueryType=Title&MaxResults=5&SearchTarget=Book&Output=JS`,
                responseType: 'json',
            }).then((res) => {
                for (let book of res.data.item){
                    const book_info = {title:book.title, author:book.author, cover:book.cover, isbn:book.isbn13}
                    results.push(book_info);
                }
            });
            if (results === [])
                return {error: true}
            return results;
        } catch (error) {
            return {error: true}
        }
    },
    
    getBooksByIsbn: async (isbns) => {
        try {
            let results = [];
            for (let isbn of isbns){
                await axios({
                    method: 'GET',
                    url: `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_TTB}&Version=20131101&itemIdType=ISBN13&ItemId=${Number(isbn)}&output=JS`,
                    responseType: 'json',
                }).then((res) => {
                    for (let book of res.data.item){
                        const book_info = {title:book.title, author:book.author, cover:book.cover, isbn:book.isbn13}
                        results.push(book_info);
                    }
                });
            }
            if (results === [])
                return {error: true}
            return results;
        } catch (error) {
            console.log(error);
            return {error: true}
        }
    },
    
};

export default booksProvider;