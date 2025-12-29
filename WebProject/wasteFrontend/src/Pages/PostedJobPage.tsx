import PostedJob from "../PostedJob/PostedJob";
const PostedJobPage=()=>{
    return(
        <div className="min-h-[100vh] bg-mine-shaft-950 font-['poppins'] px-4">        
            <div className="flex gap-5 ">
                <PostedJob/>
                {/* <PostedJobDesc /> */}
            </div>
            

            
        </div>  
    )
}
export default PostedJobPage;