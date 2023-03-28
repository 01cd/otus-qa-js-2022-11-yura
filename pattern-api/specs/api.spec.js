import {user} from '../framework/services/data.js';
import {books} from '../framework/services/data.js';
const fs = require("fs").promises;
var content = undefined;
var bookslist = {books:[]};

async function read () {
    try{
        const result = await fs.readFile("/tmp/user.txt", "utf8")
        //console.log("read_res: "+result)
        return result
    } catch (err) {
        console.error("read_error: "+err)
    };
}

//пишем во временный файл информацию о пользователе, чтобы если что-то пойдёт не так, потом можно было с ним что-то сделать, например, удалить
async function write (append) {
    if (append) {
        await fs.writeFile("/tmp/user.txt", ",."+JSON.stringify(bookslist), {'flag':'a+'}, "utf8", (err) => {if (err) console.error("write failed: "+err)});
    } else {
        await fs.writeFile("/tmp/user.txt", JSON.stringify(content), "utf8", (err) => {if (err) console.error("write failed: "+err)});
    }
} 

//разделяем строку на элементы массива по разделителю, если его нет, то вернёт строку одномерным массивом с одним элементом
function splitString(stringToSplit, separator) {
  let arrayOfStrings = stringToSplit.split(separator)
  //console.log('The array has ' + arrayOfStrings.length + ' elements: ' + arrayOfStrings.join(' / '));
  return arrayOfStrings;
}
    
//создаём юзера перед тестами и запрашиваем список книг с сайта, чтобы было с чем работать тестам  
beforeAll(async () => {
    const response = await user.create();
    if (response[0].statusText == "Created") {
        //console.log(`new user id: ${JSON.stringify(response[0].data.userID)}`);
        content = response[1];
        content.userID=response[0].data.userID
        console.log(`new user data: ${JSON.stringify(content)}`);    
        await write()
    } else {
        throw new Error("failed to create user!")
    }
    const res = await books.getBooks();
    if (res.data.books) {
        bookslist.books = [...res.data.books];
        console.log(`new books data: ${JSON.stringify(bookslist)}`); 
    } else {
        throw new Error("failed to get books list!")
    }
});

//удаляем созданного юзера после тестов
afterAll(async () => {
    let readfile = await read();
    if (typeof readfile === "string") {
        readfile = splitString(readfile, ",.")
        readfile = JSON.parse(readfile[0]);
    } else {
        throw new Error("file user.txt not found!")
    }
    const response = await user.delete({"userName": readfile.userName, "password": readfile.password},readfile.userID);
    //if (readfile){
    if (response.status === 204) {
        console.warn("Tests finished, user deleted!")
    } else {
        throw new Error("failed to delete user!")
    }
});

//тесты добавления книг пользователю
describe('#1_test_book_create', () => {
    //пробуем добавить книгу существующему пользователю с несуществующим userId 
    test('test_add_book_to_user_with_bad_userId', async function addBook() {
        try {
            const response = await books.addBook(null, null, "d83aa68b-54ae-458a-858e-4328866104ab", "d83aa68b54ae458a858e4328866104ab");
            expect(response.status).toBe(401);
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1207");
            expect(error.response.data.message).toBe("User Id not correct!");
        }
    });
    //пробуем добавить книгу новому пользователю с чужим userId 
    test('test_add_book_to_user_with_wrong_userId', async function addBook() {
        try {
            const response = await books.addBook({"userName":content.userName,"password":content.password});
            expect(response.status).toBe(401);            
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1200");
            expect(error.response.data.message).toBe("User not authorized!");
        }
    });
    //пробуем добавить книги с неверным isbn, но сайт отвечает 201... пример запроса, на который возвращает 201: "{"userId":"2f4a5a75-7d10-420f-805e-b42e0d442eef","collectionOfIsbns":[{"isbn":"sdaj8"},{"isbn":"9781449325862"}]}"
    //credentials: {"userName":"userN41271","password":"dC6^iY9^hQ","token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InVzZXJONDEyNzEiLCJwYXNzd29yZCI6ImRDNl5pWTleaFEiLCJpYXQiOjE2Nzk0OTE2NTh9.cGMU1wzl3tkiAF_-bzsVe-vW1hxK8AJRAfbdQpAUCus"}
    test('test_add_badISBN_book_to_user', async function addBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.addBook({"userName": content.userName, "password": content.password},{"userId": content.userID, "collectionOfIsbns": [{"isbn": "sdaj8"}]}, content.userID);
                expect(response.status).toBe(400);                
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {            
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1205");
            expect(error.response.data.message).toBe("ISBN supplied is not available in Books Collection!");
        }
    });
    //пробуем добавить книгу новому пользователю 
    test('test_add_book_to_user', async function addBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.addBook({"userName": content.userName, "password": content.password},{"userId": content.userID, "collectionOfIsbns": [{"isbn": booksISBN[0].isbn}]}, content.userID);
                expect(response.status).toBe(201);  
                expect(response.statusText).toBe("Created");
                expect(response.data).toHaveProperty("books");
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {
            console.error(error);
        }
    });
    //пробуем добавить ту же книгу новому пользователю опять
    test('test_add_book_to_user_again', async function addBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.addBook({"userName": content.userName, "password": content.password},{"userId": content.userID, "collectionOfIsbns": [{"isbn": booksISBN[0].isbn}]}, content.userID)                
                expect(response.status).toBe(400);                
            } else {
                throw new Error("list of ISBNs not found")                
            }                        
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1210");
            expect(error.response.data.message).toBe("ISBN already present in the User's Collection!");
        } finally {
            await books.deleteBooks({"userName": content.userName, "password": content.password}, content.userID) 
        }       
    });
    //проверяем текущие книги у пользователя
    test.skip('#test_right_user_info', async function getUser() {
        try {
            const response = await user.info({"userName": content.userName, "password": content.password},content.userID);
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(response.data.userId).toHaveLength(36);
            expect(response.data).toHaveProperty('username');
            expect(response.data).toHaveProperty('books');
            console.warn("user_books: "+JSON.stringify(response.data.books));  
        } catch (error) {
            console.error(error);        
        }
    });
    //пробуем добавить все книги новому пользователю
    test('test_add_books_to_user', async function addBook() {
        try {
            if (!!bookslist) {
                let collection = [];
                for (var ele of bookslist.books) {
                    collection.push({"isbn":ele.isbn})
                }
                const response = await books.addBook({"userName": content.userName, "password": content.password},{"userId": content.userID, "collectionOfIsbns": collection}, content.userID);
                expect(response.status).toBe(201)                
                expect(response.statusText).toBe("Created");
                expect(response.data.books).toHaveLength(8)               
            } else {
                throw new Error("list of ISBNs not found")
            }
        } catch (error) {
            console.error(error);
        } finally {
            //await books.deleteBooks({"userName": content.userName, "password": content.password}, content.userID) 
        } 
    });
});

//тесты замены книг пользователя
describe('#2_test_book_put', () => {
    //пробуем заменить книгу существующему пользователю с несуществующим userId 
    test('test_replace_book_to_user_with_bad_userId', async function replaceBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.updateBook(null, null, "d83aa68b-54ae-458a-858e-4328866104ab", "d83aa68b54ae458a858e4328866104ab");
                expect(response.status).toBe(401);
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1207");
            expect(error.response.data.message).toBe("User Id not correct!");
        }
    });
    //пробуем заменить книгу новому пользователю с чужим userId 
    test('test_replace_book_to_user_with_wrong_userId', async function replaceBook() {
        try {
            const response = await books.updateBook({"userName":content.userName,"password":content.password});
            expect(response.status).toBe(401);            
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1200");
            expect(error.response.data.message).toBe("User not authorized!");
        }
    });
    //пробуем заменить книгу с неверным старым isbn 
    test('test_replace_badISBN_book_to_user', async function replaceBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.updateBook({"userName": content.userName, "password": content.password}, null, content.userID, null, "1234567890a", booksISBN[2].isbn);
                expect(response.status).toBe(400);                
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {            
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1206");
            expect(error.response.data.message).toBe("ISBN supplied is not available in User's Collection!");
        }
    });
    //пробуем заменить книгу с неверным новым isbn 
    test('test_replace_book_of_user_to_badISBN_book', async function replaceBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.updateBook({"userName": content.userName, "password": content.password}, null, content.userID, null, booksISBN[0].isbn, "1234567890a");
                expect(response.status).toBe(400);                
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {            
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1205");
            expect(error.response.data.message).toBe("ISBN supplied is not available in Books Collection!");
        }
    });
    //пробуем заменить книгу новому пользователю 
    test('test_replace_book_to_user', async function replaceBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.updateBook({"userName": content.userName, "password": content.password}, null, content.userID, null, booksISBN[0].isbn, booksISBN[2].isbn);
                expect(response.status).toBe(200);  
                expect(response.statusText).toBe("OK");
                expect(response.data).toHaveProperty("books");
                expect(response.data.username).toBe(content.userName);
                //console.log(response.data);
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {
            console.error(error);
        }
    });
    //проверяем текущие книги у пользователя
    test.skip('#test_right_user_info', async function getUser() {
        try {
            const response = await user.info({"userName": content.userName, "password": content.password},content.userID);
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(response.data.userId).toHaveLength(36);
            expect(response.data).toHaveProperty('username');
            expect(response.data).toHaveProperty('books');
            console.warn("user_books_after_replace: "+JSON.stringify(response.data.books));  
        } catch (error) {
            console.error(error);        
        }
    });
    //пробуем заменить ту же книгу новому пользователю опять
    test('test_replace_book_to_user_again', async function replaceBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.updateBook({"userName": content.userName, "password": content.password}, null, content.userID, null, booksISBN[0].isbn, booksISBN[2].isbn)                
                expect(response.status).toBe(400);                
            } else {
                throw new Error("list of ISBNs not found")                
            }                        
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1206");
            expect(error.response.data.message).toBe("ISBN supplied is not available in User's Collection!");
        }       
    });
    //проверяем текущие книги у пользователя
    test.skip('#test_right_user_info', async function getUser() {
        try {
            const response = await user.info({"userName": content.userName, "password": content.password},content.userID);
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(response.data.userId).toHaveLength(36);
            expect(response.data).toHaveProperty('username');
            expect(response.data).toHaveProperty('books');
            console.warn("user_books_after_rereplace: "+JSON.stringify(response.data.books));  
        } catch (error) {
            console.error(error);        
        }
    });
});

//тесты получения информации о книгах
describe('#3_test_book_info', () => {    
    //пробуем запросить книгу с неверным isbn 
    test('test_get_badISBN_book', async function bookInfo() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.getBook({"userName": content.userName, "password": content.password}, {"ISBN":"hgewr3"});
                expect(response.status).toBe(400);
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {            
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1205");
            expect(error.response.data.message).toBe("ISBN supplied is not available in Books Collection!");
        }
    });
    //пробуем запросить информацию о всех книгах по очереди
    //из-за бага в жасмине test.each не работает, если сначала выполняется вызов данных асинхронный (facebook/jest/issues/2235#issuecomment-428024182), потому костыль с тестом и в нём forEach
    test(`test_get_book_by_isbn`, () => {
        if (!!bookslist) {
            bookslist.books.forEach(async function bookInfo({isbn,title,pages, ...params}) {  
                try {
                    //console.warn(isbn,params)
                    const response = await books.getBook({"userName": content.userName, "password": content.password}, {"ISBN":isbn});
                    expect(response.status).toBe(200);  
                    expect(response.statusText).toBe("OK");
                    expect(response.data).toHaveProperty("website");
                    expect(response.data.isbn).toBe(isbn);
                    expect(response.data.title).toBe(title);
                    expect(response.data.pages).toBe(pages);
                    //console.log(response);
                } catch (error) {
                    console.error(error);
                }        
            });
        } else {
            throw new Error("list of ISBNs not found")                
        } 
    });
});

//тесты удаления книг у пользователя
describe('#4_test_book_deletion', () => {
    //пробуем удалить книгу существующему пользователю с несуществующим userId  
    test('test_replace_book_to_user_with_bad_userId', async function delBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.deleteBook(null, null, "d83aa68b-54ae-458a-858e-4328866104ab", null, booksISBN[2].isbn);
                expect(response.status).toBe(401);
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1207");
            expect(error.response.data.message).toBe("User Id not correct!");
        }
    });
    //пробуем удалить книгу новому пользователю с чужим userId 
    test('test_replace_book_to_user_with_wrong_userId', async function delBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.deleteBook({"userName":content.userName,"password":content.password}, null, null, null, booksISBN[2].isbn);
                expect(response.status).toBe(401);
            } else {
                throw new Error("list of ISBNs not found")                
            }           
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(401);
            expect(error.response.statusText).toBe("Unauthorized");
            expect(error.response.data.code).toBe("1200");
            expect(error.response.data.message).toBe("User not authorized!");
        }
    });
    //пробуем удалить книгу с неверным isbn 
    test('test_replace_badISBN_book_to_user', async function delBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.deleteBook({"userName": content.userName, "password": content.password}, null, content.userID, null, "1234567890a");
                expect(response.status).toBe(400);                
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {            
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1206");
            expect(error.response.data.message).toBe("ISBN supplied is not available in User's Collection!");
        }
    });
    //пробуем удалить книгу новому пользователю, но сайт не возвращает кому и что он удалил (ответ сайта - data: '') 
    test('test_replace_book_to_user', async function delBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.deleteBook({"userName": content.userName, "password": content.password}, null, content.userID, null, booksISBN[1].isbn);
                //console.log(response);
                expect(response.status).toBe(204);  
                expect(response.statusText).toBe("No Content");
                //expect(response.data).toHaveProperty("isbn");
                //expect(response.data.userId).toBe(content.userID);
                //expect(response.data.message).toBe("string");                
            } else {
                throw new Error("list of ISBNs not found")                
            } 
        } catch (error) {
            console.error(error);
        }
    });
    //проверяем текущие книги у пользователя
    test.skip('#test_right_user_info', async function getUser() {
        try {
            const response = await user.info({"userName": content.userName, "password": content.password},content.userID);
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(response.data.userId).toHaveLength(36);
            expect(response.data).toHaveProperty('username');
            expect(response.data).toHaveProperty('books');
            console.warn("user_books_after_delete: "+JSON.stringify(response.data.books));  
        } catch (error) {
            console.error(error);        
        }
    });
    //пробуем удалить ту же книгу новому пользователю опять
    test('test_replace_book_to_user_again', async function delBook() {
        try {
            if (!!bookslist) {
                let booksISBN = bookslist.books
                const response = await books.deleteBook({"userName": content.userName, "password": content.password}, null, content.userID, null, booksISBN[1].isbn);                
                expect(response.status).toBe(400);                
            } else {
                throw new Error("list of ISBNs not found")                
            }                        
        } catch (error) {
            //console.error(error);
            expect(error.response.status).toBe(400);
            expect(error.response.statusText).toBe("Bad Request");
            expect(error.response.data.code).toBe("1206");
            expect(error.response.data.message).toBe("ISBN supplied is not available in User's Collection!");
        } finally {
            await books.deleteBooks({"userName": content.userName, "password": content.password}, content.userID) 
        }        
    });
    //проверяем текущие книги у пользователя
    test.skip('#test_right_user_info', async function getUser() {
        try {
            const response = await user.info({"userName": content.userName, "password": content.password},content.userID);
            expect(response.status).toBe(200);
            expect(response.statusText).toBe("OK");
            expect(response.data.userId).toHaveLength(36);
            expect(response.data).toHaveProperty('username');
            expect(response.data).toHaveProperty('books');
            console.warn("user_books_after_redelete: "+JSON.stringify(response.data.books));  
        } catch (error) {
            console.error(error);
        } 
    });
});
