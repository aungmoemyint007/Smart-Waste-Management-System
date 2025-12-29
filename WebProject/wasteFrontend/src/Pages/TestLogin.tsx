import { useEffect, useState } from "react"

const TestLogin = () => {
    const [name, setName] = useState('');

    useEffect(() => {
        let token = localStorage.getItem('token');
        (
            
            async () => {
                const response = await fetch("http://localhost:8000/api/user", {
                    headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`},
                    credentials: 'include'
                })

                const content = await response.json()
                console.log(token)

                setName(content.user.name)
            }
        )()
    })

    return <div>Hi {name?name:'You are not login'}</div>
}

export default TestLogin