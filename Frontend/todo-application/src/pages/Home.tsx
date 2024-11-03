import { FloatingDock } from '@/components/ui/floating-dock';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IconCirclePlus, IconClock, IconFileAnalytics, IconHome, IconLogout, IconPencil, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TooltipComponent from '@/reusableComponents/TooltipComponent';
import { Base_API_URL } from '@/services/AuthService';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Loader from '@/reusableComponents/Loader';
import extractHabitDetails, { capitalize, cn, generateTimeOptions } from '@/lib/utils';
import { BellIcon, CheckIcon } from '@radix-ui/react-icons';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch"
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

interface Item {
    _id: string;
    title: string;
    description: string;
    completedDates: string[];
    repeat: { type: string; daysOfWeek: string[] };
    startDate: string;
    time: string;
    user: string;
    __v: number;
}

const userId = localStorage.getItem('NagendraToDoAPPLogingID');
console.log("🚀 ~ userId:", userId)

const Home: React.FC = () => {
    // const navigate = useNavigate();

    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "#",
        },
        {
            title: "Analytics",
            icon: (
                <IconFileAnalytics className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/analytics",
        },
        {
            title: "Log Out",
            icon: (
                <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/login",
        },
        // {
        //     title: "Changelog",
        //     icon: (
        //         <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        //     ),
        //     href: "#",
        // },

        // {
        //     title: "Twitter",
        //     icon: (
        //         <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        //     ),
        //     href: "#",
        // },
        // {
        //     title: "GitHub",
        //     icon: (
        //         <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        //     ),
        //     href: "#",
        // },
    ];

    // useEffect(() => {
    //     if (!userId) navigate('/login');
    // }, [userId]);
    
    return (
        <>
            <BackgroundBeamsWithCollision className='h-screen'>
                <div className='h-screen'>
                    <div style={{ height: "90vh" }}>
                        <br />
                        <div className='flex justify-center'>
                            <HabitForm />
                        </div>
                        <div className='overflow-y-auto' style={{ height: "100%" }}>
                            <TodaysHabits />
                        </div>
                    </div>
                    <div className='flex w-full justify-center'>
                        <FloatingDock
                            mobileClassName="translate-y-20" // only for demo, remove for production
                            items={links}
                        />
                    </div>
                </div>
            </BackgroundBeamsWithCollision>
        </>
    );
};


const HabitForm: React.FC = () => {
    const { toast } = useToast();

    const daysOfWeekOptions = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const timeOptions = generateTimeOptions();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [repeat, setRepeat] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ title?: string; description?: string; repeat?: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [time, setTime] = useState<string>('');

    const handleCheckboxChange = (day: string) => {
        setDaysOfWeek(prevDays => {
            const updatedDays = prevDays.includes(day)
                ? prevDays.filter(d => d !== day)
                : [...prevDays, day];
            console.log(updatedDays);
            return updatedDays;
        });
    };

    const validateForm = () => {
        const newErrors: { title?: string; description?: string; repeat?: string } = {};
        if (!title) newErrors.title = 'Title is required';
        if (!description) newErrors.description = 'Description is required';
        if (!repeat) newErrors.repeat = 'Repeat option is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {

            const repeatPayload = {
                type: repeat,
                daysOfWeek: daysOfWeek
            }

            const formData = { userId, title, description, repeat: repeatPayload, time };
            console.log(formData);

            try {
                setIsLoading(true);
                const response = await fetch(`${Base_API_URL}/habit/createHabit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    console.log('LogIn successfully!');
                    const data = await response.json();
                    const message = data.message;
                    console.log("🚀 ~ handleSubmit ~ message:", message)
                    toast({
                        title: message,
                        description: "All the best!!",
                        action: (
                            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                        ),
                    })
                    setTitle('');
                    setDescription('');
                    setRepeat('');
                    setDaysOfWeek([]);
                    setErrors({});
                    setTime('');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    console.error('Error creating habit:', errorData);
                }
            } catch (err: any) {
                setErrors(err.message || 'Failed to log in');
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger>
                    <TooltipComponent
                        content="Add new habit"
                        trigger={<Button variant="outline" size="icon"><IconCirclePlus /></Button>}
                    />
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <CardHeader>
                        <CardTitle>Create habit</CardTitle>
                        <CardDescription>Deploy your new project in one-click.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Name of your habit"
                                    />
                                    {errors.title && <span className="text-red-500">{errors.title}</span>}
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your habit"
                                    />
                                    {errors.description && <span className="text-red-500">{errors.description}</span>}
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="repeat">Select Repeat Option</Label>
                                    <Select
                                        onValueChange={(value) => setRepeat(value)}
                                    >
                                        <SelectTrigger id="repeat">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="daily">Daily</SelectItem>
                                            {/* <SelectItem value="weekly">Weekly</SelectItem> */}
                                            <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.repeat && <span className="text-red-500">{errors.repeat}</span>}
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="repeat">Time</Label>
                                    <Select
                                        onValueChange={(value) => setTime(value)}
                                    >
                                        <SelectTrigger id="repeat">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            {timeOptions.map((timeOption) => (
                                                <SelectItem key={timeOption} value={timeOption}>
                                                    {timeOption}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.repeat && <span className="text-red-500">{errors.repeat}</span>}
                                </div>

                                {repeat === 'custom' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Select Days of the Week</label>
                                        <div className="flex flex-wrap mt-2">
                                            {daysOfWeekOptions.map((day) => (
                                                <label key={day} className="flex items-center mr-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={daysOfWeek.includes(day)}
                                                        onChange={() => handleCheckboxChange(day)}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-gray-700">{day}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>

                    <AlertDialogFooter>
                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>Create</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Loader isLoadingOpen={isLoading} />
        </>
    );
};


const TodaysHabits = () => {
    const { toast } = useToast();

    const [data, setData] = useState<Item[]>([]);
    console.log("🚀 ~ TodaysHabits ~ data:", data)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    console.log("🚀 ~ error:", error)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>('');
    const [reload, setReload] = useState<boolean>(false)

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    const sortedData = [...data].sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time}:00Z`).getTime();
        const timeB = new Date(`1970-01-01T${b.time}:00Z`).getTime();
        return timeA - timeB;
    });

    const HandleDeleteConfirm = async () => {
        setIsDeleteOpen(false);
        try {
            setLoading(true);
            const response = await axios.delete(`${Base_API_URL}/habit/${deleteId}`);
            if (response.status === 200) {
                console.log(response.data.message);
                setReload((reload: boolean) => !reload)
                // Update UI to reflect deletion, if needed
                toast({
                    title: response.data.message,
                    description: "Database updated!!",
                    action: (
                        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                    ),
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error(error.response.data.message);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteButtonClick = (id: string) => {
        setIsDeleteOpen(true);
        setDeleteId(id);
    }

    const handleMarkHabitDone = async (habitId: string) => {
        try {
            const response = await axios.post(`${Base_API_URL}/habit/mark-done/${habitId}`);

            if (response.status === 200) {
                console.log('Habit marked as done:', response.data.habit);
                // Update state or trigger any further actions based on the response
                setReload((reload) => !reload);
                toast({
                    title: response.data.message,
                    description: "Good!! Your productivity increased to" + response.data.habit.productivityPercentage,
                    action: (
                        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                    ),
                })
            } else {
                console.error('Failed to mark habit as done');
            }
        } catch (error) {
            console.error('Error marking habit as done:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${Base_API_URL}/habit/today/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data: Item[] = await response.json();
                setData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reload]);

    useEffect(() => {
        const details = extractHabitDetails(data);
        console.log("🚀 ~ useEffect ~ details:", details)

    }, [data]);

    if (loading) return <Loader isLoadingOpen={loading} />;
    // if (error) return <p>Error: {error}</p>;


    return (
        <>
            <div className="flex gap-3 justify-around flex-wrap p-5 pb-16 w-full">
                {sortedData.map((item: any) => {
                    const today = new Date().toDateString();
                    const isDoneToday = item.completedDates.some(
                        (date: string) => new Date(date).toDateString() === today
                    );
                    return (
                        <Card key={item._id} className={cn("w-[380px]")}>
                            <CardHeader>
                                <CardTitle className='flex gap-2 items-center justify-between'>
                                    {capitalize(item.title)}
                                    <TooltipComponent
                                        content="Edit"
                                        trigger={<Button variant="outline" size="icon" onClick={openDialog}><IconPencil /></Button>}
                                    />
                                </CardTitle>
                                <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {/* <div className="flex items-center space-x-4 rounded-md border p-4">
                                        <BellIcon />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">Push Notifications</p>
                                            <p className="text-sm text-muted-foreground">Send notifications to device.</p>
                                        </div>
                                        <Switch />
                                    </div> */}
                                <div>
                                    <div
                                        className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0    ">
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Productivity percentage
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.productivityPercentage}%
                                            </p>
                                        </div>
                                    </div>

                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>More</AccordionTrigger>
                                            <AccordionContent>
                                                <div
                                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">
                                                            Repeat
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {capitalize(item.repeat.type)} {item.repeat.daysOfWeek.length !== 0 && `- ${item.repeat.daysOfWeek.join(", ")}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">
                                                            Time
                                                        </p>
                                                        <p className="text-sm text-muted-foreground flex gap-2 items-center">
                                                            <IconClock className='' />{item.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className=" flex items-center space-x-4 rounded-md border p-4">
                                                    <BellIcon />
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-sm font-medium leading-none">
                                                            Push Notifications
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Send notifications to device. (Soon)
                                                        </p>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                </div>
                            </CardContent>

                            <CardFooter className='flex flex-col gap-2'>
                                <Button className="w-full" onClick={() => handleMarkHabitDone(item._id)} disabled={isDoneToday}>
                                    <CheckIcon /> {isDoneToday ? "Done Today" : "Done"}
                                </Button>
                                <Button className="w-full" variant="destructive" onClick={() => handleDeleteButtonClick(item._id)}><IconTrash />Delete</Button>
                            </CardFooter>
                        </Card>

                    )
                }






                )}
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit</AlertDialogTitle>
                        <AlertDialogDescription>
                            You need to get the premium version to access this option.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
                        {/* <AlertDialogAction onClick={closeDialog}>Continue</AlertDialogAction> */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deleting this habit will remove it for all days.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>Cancel</AlertDialogCancel>
                        <Button variant='destructive' onClick={HandleDeleteConfirm} >Confirm</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Home;